import Generator from 'yeoman-generator';

const answersWithoutAppName = [
  {
    type: "confirm",
    name: "extension",
    message: "Would you like to use Typescript?",
    default: false,
  },
  {
    type: "list",
    name: "uiLibrary",
    message: "Which UI library do you want to use?",
    choices: ["Tailwind CSS", "MUI", "None"]
  },
  {
    type: "list",
    name: "globalStateManagement",
    message: "What kind of global state management do you want to use?",
    choices: ["Context API", "Redux", "Zustand", "None"]
  },
];

const answersWithAppName = [
  {
    type: "input",
    name: "appname",
    message: "What is your project name?",
    default: "my-app",
  },
  {
    type: "confirm",
    name: "extension",
    message: "Would you like to use Typescript?",
    default: false,
  },
  {
    type: "list",
    name: "uiLibrary",
    message: "Which UI library do you want to use?",
    choices: ["Tailwind CSS", "MUI", "None"]
  },
  {
    type: "list",
    name: "globalStateManagement",
    message: "What kind of global state management do you want to use?",
    choices: ["Context API", "Redux", "Zustand", "None"]
  },
];


export default class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.argument("appname", { type: String, required: false });

    this.dependencies = [];
    this.devDependencies = [];
  }

  async prompting() {
    this.answers = await this.prompt(this.options.appname ? answersWithoutAppName : answersWithAppName);
  }

  writing() {
    const projectName = this.options.appname ? this.options.appname.replace(/\s+/g, '-').toLowerCase() : this.answers.appname.replace(/\s+/g, '-').toLowerCase();
    
    this._handleExtension(projectName);
    this._handleUiLibrary();

    // this.fs.copyTpl(
    //   this.templatePath('README.md'),
    //   this.destinationPath('README.md'),
    //   { description: 'My awesome app' }
    // );
  }

  _handleExtension(projectName) {
    if (this.answers.extension) {
      this.devDependencies.push('react', 'react-dom', '@testing-library/jest-dom', '@testing-library/react', '@testing-library/user-event', 'react-scripts', 'web-vitals', '@types/jest', '@types/node', '@types/react', '@types/react-dom', 'typescript')
      this.fs.copyTpl(
        this.templatePath('react-ts'),
        this.destinationPath(projectName)
      );
    } else {
      this.devDependencies.push('react', 'react-dom', '@testing-library/jest-dom', '@testing-library/react', '@testing-library/user-event', 'react-scripts', 'web-vitals');
      this.fs.copyTpl(
        this.templatePath('react-js'),
        this.destinationPath(projectName)
      );
    }
  }

  _handleUiLibrary() {
    switch (this.answers.uiLibrary) {
      case 'Tailwind CSS':
        this._installTailwindCSS();
        break;
    
      default:
        break;
    }
  }

  _installTailwindCSS() {
    
  }
};