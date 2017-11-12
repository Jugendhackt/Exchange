var fs 			= require('fs'),
	config		= JSON.parse(fs.readFileSync('config.json')),
	key_path	= (process.argv[2] || '' ).split('.'),
	result		= ''

console.log(key_path.reduce( (obj, part) => obj && obj[part] || undefined, config))