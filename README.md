# Andromeda-Viewer
Small web-client for connecting to the virtual world of [Second Life](https://secondlife.com)(TM).

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Dependency Status](https://david-dm.org/Terreii/andromeda-viewer.svg)](https://david-dm.org/Terreii/andromeda-viewer)
[![devDependency Status](https://david-dm.org/Terreii/andromeda-viewer/dev-status.svg)](https://david-dm.org/Terreii/andromeda-viewer#info=devDependencies)
[![Build Status](https://travis-ci.org/Terreii/andromeda-viewer.svg?branch=master)](https://travis-ci.org/Terreii/andromeda-viewer)

_**This viewer is not production ready!**_

## Contributing
Feel free to contribute in any way you like. You can't programm? You are still needed!

Please read and review the documentation. You can find it in the **doc-folder**.

#### Having questions?
Contact me at any time.

### How to get started
You need to have [node.js](https://nodejs.org/) version 4.2.4 or higher installed.

To start open a terminal window (cmd on windows) in your working copy of this project. And run the command "_npm install_". This will install all dependencies.

After that run "_npm run build_" to make it ready for use.

Then run "_npm start_" to start the server. Now you can use the viewer. If you want to start developing you should run in a new terminal window "_npm run watch_". It will build the viewer every time you make a change.

For more information how to use npm, please read the [npm-documentation](https://docs.npmjs.com/).

Everything needed for this project should be a npm dependency. So that all can be installed by running _npm install_

### npm scripts for this project

> npm run help

Prints out this README.md.

> npm run build

Builds the viewer. The viewer is in a unusable state after cloning.

> npm run watch

Builds the viewer. It continues to run and build the viewer when a file changes. Best developing experience!

> npm test

Runs all tests. Please run this before committing!

> npm start

Starts the server. The viewer can then be used on the local computer.

### Getting SL Protocol documentation
All documentation for the SL-protocol can be found in the [SL-Wiki](http://wiki.secondlife.com/wiki/Protocol)

## Disclaimer
[Second Life(TM)](https://secondlife.com) is a product by [Linden Lab](http://www.lindenlab.com/). Linden Lab is not involved with this project!

This is a third-party viewer! _Use it on your own risk!_
