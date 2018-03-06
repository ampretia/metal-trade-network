const gulp = require('gulp');
const Network = require('composer-cli').Network;
const Archive = require('composer-cli').Archive;
const exec = require('gulp-exec');

var usage = require('gulp-help-doc');
var args = require('yargs').argv;

var options = {
  continueOnError: false, // default = false, true means don't emit error event 
  pipeStdout: false, // default = false, true means stdout is written to file.contents 
  customTemplatingThing: "test" // content passed to gutil.template() 
};
var reportOptions = {
  err: true, // default = true, false means don't write err 
  stderr: true, // default = true, false means don't write stderr 
  stdout: true // default = true, false means don't write stdout 
}
gulp.task('docker' ,function() {
  gulp.src('./dockerfile')
  .pipe(exec('docker kill proterra-quiz && docker rm proterra-quiz'),options)
  .pipe(exec('docker build -t quiz .', options))

})

/**
 * This simply defines help task which would produce usage
 * display for this gulpfile. Simple run `gulp help` to see how it works.
 * NOTE: this task will not appear in a usage output as far as it is not
 * marked with the @task tag.
 */
gulp.task('help', function() { return usage(gulp); });


/**
 * We may also link usage as default gulp task:
 */
gulp.task('default', ['help']);


var spawn = require('child_process').spawn;

let archiveFile = './_dist/metal-trade-network.bna';


// watch thr network for changes and update network
gulp.task('watch', () => {
  gulp.watch('./packages/sample-network/**/*.cto', ['create-bna','update-network']);
  gulp.watch('./packages/sample-network/**/*.js', ['create-bna','update-network']);
  gulp.watch('./packages/sample-network/**/*.acl', ['create-bna','update-network']);
});

// create the archive file
gulp.task('create-bna' , () => {
  // let args = {archiveFile: archiveFile,
  //             sourceType: 'dir',
  //             sourceName: './network'};
  // return Archive.Create(args);
  gulp.src('./network/')
  .pipe(exec('composer archve create '),options)
  .pipe(exec.reporter(reportOptions));
} );

// update the network
gulp.task('update', ['create-bna'], () => {
  let args = {enrollId: 'admin'
             ,enrollSecret: 'adminpw'
             ,archiveFile: archiveFile
             ,connectionProfileName: 'hlfv1'};

   return Network.Update(args);
});

/**
 * Deploys the network for the first time
 * Tearsdown and restarts Fabric
 *
 * @task {deploy}
 * deploy the network first time
 */
gulp.task('deploy', ['create-bna','start','createProfile'],() => {
  let args = {enrollId: 'PeerAdmin'
             ,enrollSecret: 'anything'
             ,archiveFile: archiveFile
             ,connectionProfileName: 'hlfv1'};

   return Network.Deploy(args);
});

gulp.task('createProfile', ['rebuild'],(cb) => {
  var ls = spawn('./scripts/fabric-tools/createComposerProfile.sh', {stdio: 'inherit'});

  ls.on('close',  (code) => {
      console.log('child process exited with code ' + code);
      cb();
  });
}
);

gulp.task('start', ['rebuild'],(cb) => {
  var ls = spawn('./scripts/fabric-tools/startFabric.sh', {stdio: 'inherit'});

  ls.on('close',  (code) => {
      console.log('child process exited with code ' + code);
      cb();
  });
}
);

gulp.task('rebuild', ['teardown'] , (cb) => {
  var ls = spawn('./redo-runtime.sh', {stdio: 'inherit'});

  ls.on('close',  (code) => {
      console.log('child process exited with code ' + code);
      cb();
  });
}
);

gulp.task('teardown', (cb) => {
  var ls = spawn('./scripts/fabric-tools/teardownFabric.sh', {stdio: 'inherit'});

  ls.on('close',  (code) => {
      console.log('child process exited with code ' + code);
      cb();
  });
}
);
