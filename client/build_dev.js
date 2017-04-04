var copy 	= require('copy'),
	fs 		= require('fs')

config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

if(!fs.existsSync('dev')) fs.mkdir('dev')

copy("src/js/**/*.js", "dev/js", function(){})
copy("src/pages/**/*.html", "dev/pages", function(){})
copy("src/partials/**/*.html", "dev/partials", function(){})
copy("src/styles/**/*.css", "dev/styles", function(){})

copy("vendor.js", "dev/js", function(){})
copy("config.json", "dev", function(){})
copy("countries_de.json", "dev", function(){})

// Index:
var content = fs.readFileSync('src/index.html', 'utf8').replace(/CONFIG\.BACKEND\_LOCATION/g, config.backendLocation)


fs.writeFileSync('dev/index.html', content, 'utf8')

// Styles:

/// Roboto:
copy("node_modules/roboto-fontface/fonts/Roboto/**/*", "dev/fonts/Roboto", function(){})
copy("node_modules/roboto-fontface/css/**/roboto-fontface.css", "dev/styles", function(){})


/// Angular Material:
copy("node_modules/angular-material/**/angular-material.min.css", "dev/styles", function(){})

/// Material Icons:
copy("node_modules/material-design-icons/iconfont/**/material-icons.css", "dev/styles/material-icons", function(){})
copy("node_modules/material-design-icons/iconfont/**/MaterialIcons*.*", "dev/styles/material-icons", function(){})





