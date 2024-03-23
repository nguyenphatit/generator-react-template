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
    this._handleUiLibrary(projectName);
    this._handleGlobalStateManagement(projectName);
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

  _handleUiLibrary(projectName) {
    switch (this.answers.uiLibrary) {
      case 'Tailwind CSS':
        this._installTailwindCSS(projectName);
        break;
    
      case 'MUI':
        this._installMUI(projectName);
        break;

      default:
        break;
    }
  }

  _installTailwindCSS(projectName) {
    this.devDependencies.push('tailwindcss');
    
    const packageJsonPath = this.destinationPath(projectName + '/package.json');
    const packageJson = this.fs.readJSON(packageJsonPath) || {};

    if (packageJson.devDependencies === undefined) {
      packageJson.devDependencies = {};
    }

    packageJson.devDependencies['tailwindcss'] = '^3.0.0';

    this.fs.writeJSON(packageJsonPath, packageJson, { force: true });
    this.fs.delete(this.destinationPath(projectName + '/src/assets/styles/App.css'));
    this.fs.delete(this.destinationPath(projectName + '/src/assets/styles/index.css'));
    
    this.fs.copyTpl(
      this.templatePath('tailwindcss/index.css'),
      this.destinationPath(projectName + '/src/assets/styles/index.css')
    );

    if (this.answers.extension) {
      this.fs.delete(this.destinationPath(projectName + '/src/App.tsx'));
      this.fs.copyTpl(
        this.templatePath('tailwindcss/App.tsx'),
        this.destinationPath(projectName + '/src/App.tsx')
      );
    } else {
      this.fs.delete(this.destinationPath(projectName + '/src/App.jsx'));
      this.fs.copyTpl(
        this.templatePath('tailwindcss/App.jsx'),
        this.destinationPath(projectName + '/src/App.jsx')
      );
    }
    this.fs.copy(
      this.templatePath('tailwindcss/tailwind.config.js'),
      this.destinationPath(projectName + '/tailwind.config.js')
    );
  }

  _installMUI(projectName) {
    this.dependencies.push('@emotion/react', '@emotion/styled', '@fontsource/roboto', '@mui/icons-material', '@mui/material');

    this.fs.delete(this.destinationPath(projectName + '/public/index.html'));
    this.fs.copy(
      this.templatePath('mui/index.html'),
      this.destinationPath(projectName + '/public/index.html')
    );

    if (this.answers.extension) {
      this.fs.delete(this.destinationPath(projectName + '/src/App.tsx'));
      this.fs.copyTpl(
        this.templatePath('mui/App.tsx'),
        this.destinationPath(projectName + '/src/App.tsx')
      );
    } else {
      this.fs.delete(this.destinationPath(projectName + '/src/App.jsx'));
      this.fs.copyTpl(
        this.templatePath('mui/App.jsx'),
        this.destinationPath(projectName + '/src/App.jsx')
      );
    }
  }

  _handleGlobalStateManagement(projectName) {
    
  }
};