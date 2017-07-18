'use strict';

var gulp = require('gulp');
var fs = require('fs');
var url = require('url');
var path = require('path');

var _ = require('lodash');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

var env = require('./env');

var getRulesFor = function (config, url) {
  return _.filter(config.rules, function (rule) {
    if (_.isString(rule.url)) {
      // 如果是字符串，则只从开头位置匹配
      rule.url = new RegExp('^' + rule.url.replace(/\/$/, '') + '/(.*)$');
    }
    return rule.url.test(url);
  });
};
var cascadeRules = function (rules) {
  var result = {};
  // 把规则逐层叠加起来
  _.each(rules, function (rule) {
    _.extend(result, rule);
  });
  return result;
};

function delayMiddleware(req, res, next) {
  var rules = getRulesFor(env.config, req.url);
  var rule = cascadeRules(rules);
  if (rule.delay) {
    setTimeout(function () {
      next();
    }, rule.delay);
  } else {
    next();
  }
}

var proxy = httpProxy.createProxyServer({
  // ssl: {
  //   key: fs.readFileSync('ssl-key.pem', 'utf-8'),
  //   cert: fs.readFileSync('ssl-cert.pem', 'utf-8')
  // },
  changeOrigin: true,
  secure: false
});

proxy.on('error', function (e, req, res) {
  res.writeHead(502, {
    'Content-Type': 'text/plain;charset=utf-8'
  });
  if (e.code === 'ECONNREFUSED') {
    res.end('网关错误！请检查反向代理对应的后端服务器是否启动成功。');
  } else {
    res.end('网关错误！未知原因，代码: ' + e.code);
  }
});

function proxyMiddleware(req, res, next) {
  var rules = getRulesFor(env.config, req.url);
  // 代理的规则不需要层叠
  var rule = _.find(rules.reverse(), function (rule) {
    return rule.proxy;
  });
  // 反向代理
  if (rule && rule.proxy) {
    // path和domain使用对方的
    var proxyParts = url.parse(rule.proxy);
    rule.cookie.path = rule.cookie.path || proxyParts.pathname.replace('/(.*?)/.*', '/$1');
    rule.cookie.domain = rule.cookie.domain || proxyParts.host;

    res.oldSetHeader = res.setHeader;
    res.setHeader = function (name, value) {
      // patch set-cookie/path, set-cookie/domain
      if (name.toLowerCase() === 'set-cookie') {
        value = _.map(value, function (cookie) {
          cookie = cookie.replace(/path=\/(.*?)(;|$)/gi, 'path=' + rule.cookie.path + ';');
          cookie = cookie.replace(/domain=\/(.*?)(;|$)/gi, 'domain=' + rule.cookie.domain + ';');
          return cookie;
        });
      }
      res.oldSetHeader(name, value);
    };
    req.url = req.url.replace(rule.url, rule.rewrite || '/$1');
    proxy.web(req, res, {target: rule.proxy});
    console.log('req url:', req.url);
    console.log('target:', rule.proxy);
  } else {
    next();
  }
}

var baseDirs = [
  '.',
  'app',
  '.tmp/app'
];


function browserSyncInit(baseDir, files, port, success, browser) {
  browser = browser === undefined ? 'default' : browser;

  return browserSync({
    ui: {
      weinre: {
        port: 9090
      }
    },
    routes: {
      "/bower_components": env.folders.library
    },
    files: files,
    ghostMode: !!env.args.clone, // 默认禁止操作克隆功能，在开发阶段，同步操作带来的困扰大于收益
    https: env.args.s || env.args.https,
    startPath: '/',
    logPrefix: 'FJ',
    server: {
      baseDir: baseDir,
      // 用户自定义的middleware优先。fork必须在historyApi前面，以便对fork处理后再判断是否存在
      middleware: (env.config.middlewares || []).concat([delayMiddleware, proxyMiddleware])
    },
    browser: browser,
    port: port,
    open: 'ui'
  }, success);
}

gulp.task('reload', function () {
  browserSync.reload();
});

gulp.task('serve', ['config', 'watch'], function () {
  var port = +(env.args.port || env.args.p) || env.ports.server;
  browserSyncInit(
    baseDirs,
    [
      '.tmp/app/**/*.css',
      '.tmp/app/**/*.js',
      '!.tmp/app/**/*.test.js',
      'app/**/*.html',
      'app/**/*.htm',
      'app/**/*.css',
      'app/**/*.js',
      '!app/**/*.test.js',
      'app/images/**/*',
      'app/fonts/**/*'
    ],
    port, function (error, bs) {
      // gulp.start('tdd');
    });
});

gulp.task('server', ['serve']);


gulp.task('config', function () {
  var file = env.folders.project + '/proxy.conf.js';
  var defaultValue = env.config

  delete require.cache[require.resolve(file)];
  var configure = require(file);
  configure(defaultValue);
});
