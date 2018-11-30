const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const ejs = require('ejs');
const octokit = require('@octokit/rest')();

const data = require('./data');

function indexHandler (_, res) {
  res.redirect('https://github.com/apps/gaugebot');
}

function claHandler (req, res) {
  let refererUrl = req.get('Referrer') || process.env.REERRER;
  if(refererUrl) res.cookie('referer_url', refererUrl);
  let s = fs.readFileSync('./views/cla.ejs', 'utf8');
  renderPageWithLayout(s, res);
}

function errorHandler (_, res) {
  let s = fs.readFileSync('./views/error.ejs', 'utf8');
  renderPageWithLayout(s, res);
}

function isGithubURL (url) {
  return url.startsWith('https://github.com') && url.includes('pull');
}

function getPRInfo (url) {
  if (!isGithubURL(url)) return;
  let info = url.replace('https://github.com/', '').split('/');
  return {
    owner: info[0],
    repo: info[1],
    number: +info[3]
  };
}

async function createRecheckComment (token, url) {
  let prInfo = getPRInfo(url);
  if (!prInfo) return;
  prInfo.body = '@gaugebot recheck the pull request.';
  octokit.authenticate({ type: 'token', token: token });
  await octokit.issues.createComment(prInfo);
}

async function authCallbackHandler (req, res) {
  let p = req.user.profile._json;
  addContributor(p);
  let d = { name: p.name, nickname: p.login, referer:{} };
  let url = req.cookies.referer_url;
  res.clearCookie('referer_url');
  if (url) {
    d.referer.url = url;
    await createRecheckComment(req.user.accessToken, url);
  }
  let content = fs.readFileSync('./views/user.ejs', 'utf8');
  renderPageWithLayout(ejs.render(content, d), res);
}

async function contributorHandler (req, res) {
  let c = req.query.checkContributor;
  if (c) {
    let user = await data.getContributor(c);
    let response = user ? { hasSignedCLA: true, info: user } : c + ' has not signed the cla.';
    res.send(response);
  } else {
    res.send(`Please use the url ${req.headers.host}/contributor/checkContributor?CONTRIBUTOR_NAME`);
  }
}

function addContributor (profile) {
  const user = {
    name: profile.name,
    email: profile.email || '',
    nickname: profile.login,
    userID: profile.id || '',
    description:profile.bio && profile.bio.replace(/'/g,"''") || '',
    time: new Date().toLocaleDateString()
  }
  data.addUser(user);
}

function renderPageWithLayout (data, res) {
  ejs.renderFile('./views/layout.ejs', { body: data }, function (_, str) {
    res.send(str);
  })
}

async function contributorsURLHandler (req, res) {
  let contributors = await data.getAllContributors();
  res.send(contributors);
}

function configureHandlers (route) {
  route.use(express.static('./public'));
  route.get('/', indexHandler);
  route.get('/cla', claHandler);
  route.get('/' + process.env.CONTRIBUTOR_URL, contributorsURLHandler);
  route.get('/contributor', contributorHandler);
  route.get('/auth/github', passport.authenticate('github'));
  route.get('/auth/error', errorHandler);
  route.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error' }), authCallbackHandler
  );
  route.get('*', errorHandler);
}

function configurePassport (route) {
  route.use(passport.initialize());
  route.use(passport.session());
  passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  }, function (accessToken, _refreshToken, profile, done) {
    done(null, { accessToken: accessToken, profile: profile });
  }));
  passport.serializeUser(function (user, done) { done(null, user) });
  passport.deserializeUser(function (user, done) { done(null, user) });
}

module.exports = function (app) {
  let route = app.route();
  route.use(cookieParser());
  route.use(bodyParser.urlencoded({ extended: false }));
  route.use(session({ secret: 'guagebot' }));
  configurePassport(route);
  configureHandlers(route);
}

