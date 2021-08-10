module.exports = {
    apps : [{
      name: 'monit',
      script: '/opt/node_agent/index.js',
      watch: '.'
    }]
  };