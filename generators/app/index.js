const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('projectdir', { type: String, required: true });

    this.log(this.options.projectdir);
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the ${chalk.red('yalo-hapi')} generator!`));

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name:',
        default: 'my-awesome-project',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description:',
      },
      {
        type: 'input',
        name: 'repository_url',
        message: 'Your repo url:',
        default: '',
      },
      {
        type: 'input',
        name: 'node_version',
        message: 'Node version for your project:',
        default: '10.15.1',
      },
    ]);
  }

  writing() {
    const currentDestination = this.destinationRoot();

    this.destinationRoot(`${currentDestination}/${this.options.projectdir}`);

    const templateFiles = [
      '.nvmrc',
      'config.js',
      'Dockerfile',
      'package.json',
    ];

    const excludedFiles = ['templates', 'package-lock.json', 'handlers', ...templateFiles];

    templateFiles.forEach((template) => {
      this.fs.copyTpl(
        this.templatePath(`templates/_${template}`),
        this.destinationPath(template),
        this.answers,
      );
    });

    const files = fs.readdirSync(this.sourceRoot())
      .filter(file => !excludedFiles.includes(file));

    // this `file` variable, could be a dir name
    files.forEach((file) => {
      this.fs.copy(
        this.templatePath(file),
        this.destinationPath(file),
      );
    });

    this.fs.write(this.destinationPath('handlers/.gitkeep'), '');
  }

  install() {
    this.npmInstall();
  }
};
