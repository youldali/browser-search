const ghpages = require('gh-pages');

ghpages.publish('build', (err) => {
  console.error('Error occured when publishing');
  console.log(err);
});