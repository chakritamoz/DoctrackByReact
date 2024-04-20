const Privilege = require('../models/privilege');
const Role = require('../models/role');

exports.intialPrivilege = async () => {
  try {
    const privileges = [
      { name: 'createRole', description: 'Features to create new role' },
      { name: 'editRole', description: 'Features to edit role' },
      { name: 'deleteRole', description: 'Features to delete role' },
      { name: 'createPrivilege', description: 'Features to create new privilege' },
      { name: 'editPrivilege', description: 'Features to edit privilege' },
      { name: 'deletePrivilege', description: 'Features to delete privilege' },
      { name: 'createDocument', description: 'Features to create new documents' },
      { name: 'editDocument', description: 'Features to edit documents' },
      { name: 'deleteDocument', description: 'Features to delete documents' },
      { name: 'createJob', description: 'Features to create new job' },
      { name: 'editJob', description: 'Features to edit job' },
      { name: 'deleteJob', description: 'Features to delete job' },
      { name: 'createPrefix', description: 'Features to create new prefix' },
      { name: 'editPrefix', description: 'Features to edit prefix' },
      { name: 'deletePreifx', description: 'Features to delete prefix' },
    ];

    await Privilege.create(privileges);
    console.log('Initial and saved privilege');
  } catch (err) {
    console.log(err);
  }
}

// Before initial role 
// you have to intial privilege first
exports.initialRole = () => {
  try {
    const role = [
      { name: 'owns', description: 'Full access to all features' },
      { name: 'administrator', description: 'Access to all features except system feature'},
      { name: 'documentKeeper', description: 'Access to only document feature' },
      { name: 'mapKeeper', description: 'Access to only map feature'}
    ]
  } catch (err) {
    console.log(err);
  }
}