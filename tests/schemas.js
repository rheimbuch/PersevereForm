dojo.provide('yogo.tests.schemas');

yogo.tests.schemas.Person = { 
    id: "Person",
    description: "A basic person schema",
    properties: {
        firstName: {
            type: "string",
            title: "First Name"
        },
        lastName: {
            type: "string",
            title: "Last Name"
        },
        birthday: {
            type: "string",
            format: "date-time",
            title: "Birth Date"
        },
        birthHour: {
            type: "string",
            format: "time",
            title: "Hour of Birth"
        },
        email: {
            type: "string",
            format: "email",
            title: "Email"
        }
    }
}

yogo.tests.schemas.Company = {
    id: "Company",
    description: "Example of a nexted schema",
    properties: {
        name: {
            type: "string",
            title: "Company Name"
        },
        manager: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                    title: "First Name"
                },
                lastName: {
                    type: "string",
                    title: "Last Name"
                },
                birthday: {
                    type: "string",
                    format: "date-time",
                    title: "Birth Date"
                }
            }
        }
    }
};