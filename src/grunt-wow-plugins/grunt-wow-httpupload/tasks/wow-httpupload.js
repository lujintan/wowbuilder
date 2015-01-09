module.exports = function(grunt) {

  var fs = require('fs');
  var rest = require('restler');

  grunt.registerMultiTask('wow-httpupload', 'Upload files through POST/PUT HTTP request', function() {
    var done = this.async();

    var options = this.options({
        method: 'POST',
        headers: {},
        url:    ''
      }),
      fileSendLength = 0,
      sendedLength = 0;

    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function(f) {
      var filepath = f.src[0];
      var field    = f.dest;

      if (!grunt.file.exists(filepath)) {
        grunt.fail.warn('Source file "' + filepath + '" not found.');
        return false;
      }

      fs.stat(filepath, function(err, stats) {
        if (err) {
          grunt.fail.warn('Error: ' + err);
          done(err);
        } else if (stats.isFile()) {
          var fileSize = stats.size;
          grunt.log.writeln('Uploading "' + filepath + '" as "' + field + '"');

          var sendData = {};
          sendData[field] = rest.file(filepath, null, fileSize, null, null);
          sendData.dest = field;
          fileSendLength++;
          rest.request(options.url, {
            method: options.method,
            headers: options.headers,
            multipart: true,
            data: sendData
          }).on('complete', function(data, response) {
            if (response.statusCode >= 200 && response.statusCode < 300) {
              grunt.log.ok('Upload successful of "' + filepath + '" as "' + field + '" - ' + options.method + ' @ ' + options.url);
            } else {
              grunt.fail.warn('Failed uploading "' + filepath + '" as "' + field + '" (status code: ' + response.statusCode + ') - ' + options.method + ' @ ' + options.url);
            }
            sendedLength++;
            if (sendedLength == fileSendLength){
              done(data);
            }
          });
        }
      });
    });

    if (!this.files.length){
      done();
    }
  });
};
