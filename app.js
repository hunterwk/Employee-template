const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const teamMembers= [];
const idArr=[];

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const questionsArr = [
    {
        type: "input",
        name: "name",
        message: "What is the Employee's name?",
        validate: answer => {
            if (answer) {
                return true;
            }
            return "Please Enter a valid name";
        }
    },
    {
        type: "input",
        name: "id",
        message: "What is the Employee's ID number?",
        validate: answer => {
            if (answer > 0 && answer <= 20 && !idArr.includes(answer)) {
                return true;
            }
            return "Id code is invalid."
        }
    },
    {
        type: "input",
        name: "email",
        message: "What is the Employee's email address?",
        validate: answer => {
            if (answer.match(/\S+@\S+\.\S+/)) {
                return true;
            }
            return "Please Enter a valid email address.";
        }
    }
]

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function createTeam() {
    inquirer.prompt ({
        type: "list",
        name: "member",
        message: "Which team member do you want to add?",
        choices: ["Manager", "Engineer", "Intern", "Exit"],
    }).then (choice => {
        switch (choice.member){
            case "Engineer": 
                createEngineer();
                break;
            case "Manager":
                createManager();
                break;
            case "Intern":
                createIntern();
                break;
            default: 
                renderTeam();
                break;
        }
    } )  
}



function createManager() {
    const qArr = [...questionsArr]
    qArr.push(
        {
            type: "input",
            name: "officeNumber",
            message: "What is the Manager's office number?",
            validate: answer => {
                if (answer) {
                    return true;
                }
                return "Please Enter a valid office number.";
            }
        }
    )
    
    inquirer.prompt(qArr).then (response => {
        const manager = new Manager (response.name, response.id, response.email, response.officeNumber)
        teamMembers.push(manager);
        idArr.push(response.id);
        createTeam();
    })
}

function createEngineer() {
    const qArr = [...questionsArr]
    qArr.push(
        {
            type: "input",
            name: "github",
            message: "What is the Engineer's github username?",
            validate: answer => {
                if (answer) {
                    return true;
                }
                return "Please Enter a valid github username.";
            }
        }
    )
    inquirer.prompt(qArr).then (response => {
        const engineer = new Engineer (response.name, response.id, response.email, response.github)
        teamMembers.push(engineer);
        idArr.push(response.id);
        createTeam();
    })
}

function createIntern() {
    const qArr = [...questionsArr]
    qArr.push(
        {
            type: "input",
            name: "school",
            message: "What is the Intern's school?",
            validate: answer => {
                if (answer) {
                    return true;
                }
                return "Please Enter a valid school";
            }
        }
    )
    inquirer.prompt(qArr).then (response => {
        const intern = new Intern (response.name, response.id, response.email, response.school)
        teamMembers.push(intern);
        idArr.push(response.id);
        createTeam();
    })
}


createTeam();

function renderTeam() {
    if (!fs.existsSync (OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8")
}


