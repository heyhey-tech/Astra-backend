const getAllUsers = require('../Database_scripts/Scripts/RDS/getAllUsers');  

async function getUsers(){
    try{
        const users= await getAllUsers();
        const emails = users.map(user => user.email);
        console.log("INSDIE GETUSERS:",emails);
        return emails;


    }catch(err){
        console.log(err);
        return err;
    }
    // edit the metadata of the given tokenID
}

module.exports = getUsers;

// getUsers();