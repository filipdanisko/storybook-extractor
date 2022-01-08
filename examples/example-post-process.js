const fs = require('fs');

// Example post-process function outputing all links to stories.
module.exports = function process(data) {
  // Gather links
  const links = data.map(item => {
    return item.urls.storyUrl;
  })

  // Write to file system
  fs.writeFile('./examples/example-post-process-output.json', JSON.stringify(links), err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
    console.log('File has been saved!')
  })
};
