// Console.log function
const log = console.log;

const colorLog = (text, color) => {
  const log = console.log;
  import('chalk')
    .then(({ default: chalk }) => {
      console.log(chalk[color].bold(text));
    })
    .catch((err) => {
      console.error('Error importing chalk:', err);
    });
};

module.exports = { colorLog };
