const Privilege = require('../models/privilege');
const Role = require('../models/role');

exports.intialPrivilege = async () => {
  try {
    // Initial privilege data
    const privileges = [
      { name: 'privilege-management', description: 'Features to privilege management' },
      { name: 'role-management', description: 'Features to role management' },
      { name: 'document-management', description: 'Features to document management' },
      { name: 'genre-management', description: 'Features to genre management' },
      { name: 'job-management', description: 'Features to job management' },
      { name: 'prefix-management', description: 'Features to prefix management' },
      { name: 'map-management', description: 'Features to map management'},
    ];

    await Privilege.create(privileges);
    console.log('Initial and saved privilege');
  } catch (err) {
    console.log(err);
  }
}

// Before initial role 
// you have to intial privilege first
exports.initialRole = async () => {
  try {
    const privileges = await Privilege.find({});

    // Initial role data
    const role = [
      { 
        name: 'owns', 
        description: 'Full access to all features',
        privilege: privileges.map(priv => priv._id)
      },
      { 
        name: 'administrator', 
        description: 'Access to all features except system feature',
        privilege: privileges
          .filter(priv => 
            priv.name !== 'role-management' || priv.name !== 'privilege-management'
          ).map(priv => priv._id)
      },
      {
        name: 'keeper',
        description: 'Access to only document and map feature',
        privilege: privileges
          .filter(priv =>
            priv.name === 'document-management' || priv.name === 'map-management'
          ).map(priv => priv._id)
      },
      { 
        name: 'documentKeeper', 
        description: 'Access to only document feature',
        privilege: [privileges.find(priv => priv.name === 'document-management')._id]
      },
      { 
        name: 'mapKeeper',
        description: 'Access to only map feature',
        privilege: [privileges.find(priv => priv.name === 'map-management')._id]
      }
    ];

    await Role.create(role);
    console.log('Initial and saved role');
  } catch (err) {
    console.log(err);
  }
}