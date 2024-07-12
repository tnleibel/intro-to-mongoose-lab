const prompt = require('prompt-sync')();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await runQueries()
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit();
};

const runQueries = async () => {
  console.log('Queries running.')
    while(running === true) {
        promptUser()
        if(choice === "1") {
            await createCustomer()
        }
        if(choice === "2") {
            await getAllCustomers()
        }
        if(choice === "3") {
            await updateCustomer()
        }
        if(choice === "4") {
            await deleteCustomer()
        }
        if(choice === "5") {
            await exit()
        }
    }
};

connect()
console.log("Welcome to the CRM")
const Customer = require('./models/customer.js');
let choice 
let running = true


function promptUser() {
    console.log("What would you like to do?\n\n   1. Create a customer\n   2. View all customers\n   3. Update a customer\n   4. Delete a customer\n   5. Quit\n")
    choice = prompt("Number of action to run: ")
}

const createCustomer = async () => {
    const namePrompt = prompt("What is the new customer's name? ")
    const agePrompt = prompt("What is the new customer's age? ")
    const customerData = {
        name: namePrompt,
        age: agePrompt
    }
    const customer = await Customer.create(customerData)
    console.log(`New customer: ${customer}`)
}

const getAllCustomers = async () => {
    const customers = await Customer.find()
    console.log(`All customers: ${customers}\n`)
}

const updateCustomer = async () => {
    const customers = await Customer.find()
    console.log("Below is a list of customers:\n")
    customers.forEach((customer) => {
        console.log(`id: ${customer.id} -- Name: ${customer.name}, Age: ${customer.age}\n`)
    })
    const idPrompt = prompt("Copy and paste the id of the customer you would like to update here:")
    const id = idPrompt
    const customer = await Customer.findById(id)
    const updateNamePrompt = prompt("What is the customer's new name? ")
    const updateAgePrompt = prompt("What is the customer's new age? ")
    customer.name = updateNamePrompt
    customer.age = updateAgePrompt
    await customer.save()
    
    console.log(`Updated customer: ${customer}\n`)
}

const deleteCustomer = async () => {
    const customers = await Customer.find()
    console.log("Below is a list of customers:\n")
    customers.forEach((customer) => {
        console.log(`id: ${customer.id} -- Name: ${customer.name}, Age: ${customer.age}\n`)
    })
    const idPrompt = prompt("Copy and paste the id of the customer you would like to delete here:")
    const id = idPrompt
    const customer = await Customer.findByIdAndDelete(id)
    console.log(`Customer ${customer.name} has been deleted.\n`)
}

const exit = async () => {
    running = false
    await mongoose.connection.close()
}