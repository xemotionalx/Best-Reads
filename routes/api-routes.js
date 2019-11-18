var passport = require("../config/passport");
var xmlConvert = require("xml-js");
var fetch = require("node-fetch");
const fs = require("fs");
const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile"]
    })
  );

  app.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  });

  app.get("/user", (req, res) => {
    if (req.session.passport) {
      res.json(req.session.passport.user.displayName);
    } else {
      res.json(false);
    }
  });
  app.get("/xmltest2", (req, res) => {
    var queryURL =
      "https://www.goodreads.com/search/index.xml?key=ntj35uAln93Ca74x0mChdA&q=Madeline";

    fetch(queryURL)
      .then(response => response.text())
      .then(data => {
        // data = the raw xml data
        // console.log(data);
        var compactJson = xmlConvert.xml2js(data, {
          compact: true,
          spaces: 4
        });
        // console.log(compactJson);
        storeData(compactJson, "./compactJSON.txt");
        res.json(compactJson);
      });
  });

  app.get("/xmltest", (req, res) => {
    var queryURL =
      "https://www.goodreads.com/search/index.xml?key=ntj35uAln93Ca74x0mChdA&q=Madeline";

    fetch(queryURL)
      .then(response => response.text())
      .then(data => {
        // data = the raw xml data
        // console.log(data);

        var fullJson = xmlConvert.xml2js(data, {
          compact: false,
          spaces: 4
        });
        // console.log(fullJson);
        storeData(fullJson, "./fullJSON.txt");
        res.json(fullJson);
      });
  });

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/"
    }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect("/test");
      // res.json(req.user.displayName)
    }
  );
};