# University-Operations-Research-Tool
This projects aims to create a tool for easy calculation of operations research modules on different device platforms.

## Table of Contents
- [Features](#features) 
- [Installation/Access](#installationaccess)
- [Usage](#usage)
- [Supported problem types](#supported-problem-types)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Issues](#issues)

## Features
 - Export as LP (Linear Programming) and  MPS(Mathematical Programming System)
 - Measuring elapsed real time 
 - Logging
 - Solving via GLPK

## Installation/Access
### Online
You can always access the Tool without any installation on our [GitHub Pages instance](https://spaceholder-programming.github.io/Operations-Research-Tool/).
### Local
#### Install dependencies
This project relies on [NextJs](https://nextjs.org/). Please follow its [installation instructions](https://nextjs.org/docs/getting-started/installation) to get everything ready. 
#### Clone the repository
Using Git:
```Bash
git clone https://github.com/Spaceholder-Programming/Operations-Research-Tool.git
```
#### Building the site
Navigate towards the folder, where the project is located on your machine via terminal.
Afterwards, execute the following command:

```Bash
npm install
```
This installs the necessary dependencies.
Next execute:
```Bash
npm build
```
#### Run 
```
npm start
```
#### Access the Tool using your browser:
You can access the tool via browser on your machine. The default port is 3000. 

If you can not reach the tool under [this link](http://localhost:3000), the default port is blocked and you have to check the terminal to get the correct port. 

## Usage
The tool provides a user-friendly interface to solve operations research problems. You can access it locally after installation or through the web interface if hosted online.
Solving a Problem
Input your model data in the boxes (constraints, variables, objective functions).
Click "Calculate" to see the results.

### Supported problem types
+ Linear
+ Mixed Integer

## Contributing
1. Fork the repository
2. Create a new branch: `git checkout -b featurename`
3. Implement your changes
4. Push your branch: `git push origin featurename`
5. Create a pull request
# License
This project is licensed under the [MPL-2.0 License](https://github.com/Spaceholder-Programming/Operations-Research-Tool?tab=MPL-2.0-1-ov-file).
# Contact
If you have the desire to contact the team behind this project, use the contact details on our GitHub accounts:
+ [bRNS98](https://github.com/bRNS98)
+ [moebiusl](https://github.com/moebiusl)
+ [SinusFox](https://github.com/SinusFox)
+ [widepoeppihappy](https://github.com/widepoeppihappy)
# Issues
If you encounter a bug, please contact us by [creating an issue](https://github.com/Spaceholder-Programming/Operations-Research-Tool/issues/new).
