const { Confirm } = require('enquirer');

module.exports = (logger, added, modified, deleted, unchanged, options) => {

  added.forEach((object) => {
    logger.info(`${object.path.relative} will be added`);
  });

  modified.forEach((object) => {
    logger.info(`${object.path.relative} will be modified`);
  });

  deleted.forEach((object) => {
    logger.warn(`${object.path.relative} will be ${options.softDelete ? 'soft-deleted' : 'deleted'}`);
  });

  unchanged.forEach((object) => {
    logger.warn(`${object.path.relative} will be kept unchanged`);
  });

  return Promise.resolve(
    (!options.nonInteractive && (added.length || modified.length || deleted.length))
      ? new Confirm({ message: 'Proceed with deployment?' }).run()
      : true
  )
    .then((confirmed) => confirmed ? { added, deleted, modified, unchanged } : Promise.reject(new Error('Deployment was aborted by the user')));

};
