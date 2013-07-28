Package.describe({summary: "Firmata based Arduino Programming Framework."})

Npm.depends({"johnny-five": "https://github.com/jongd/johnny-five/tarball/e559c10ea4cfa8477f2b661f3457734d136e9e86"});
//Npm.depends({"johnny-five": "0.7.0"})

Package.on_use(function (api) {
  api.add_files("johnny-five.js", "server")
});