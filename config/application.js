/* Exports an object that defines
 *  all of the configuration needed by the projects'
 *  depended-on grunt tasks.
 *
 * You can familiarize yourself with all of Lineman's defaults by checking out the parent file:
 * https://github.com/testdouble/lineman/blob/master/config/application.coffee
 */

module.exports = require(process.env['LINEMAN_MAIN']).config.extend('application', {

  // html5push state simulation
  server: {
    pushState: true
  },

  // configure lineman to load additional angular related npm tasks
  loadNpmTasks: [
    "grunt-angular-templates",
    "grunt-concat-sourcemap",
    "grunt-haml",
    "grunt-ngmin"
  ],

  // we don't use the lineman default concat, handlebars, and jst tasks by default
  removeTasks: {
    common: ["concat", "handlebars", "jst", "pages:dev"],
    dist: ["pages:dist"]
  },

  // task override configuration
  prependTasks: {
    common: ["haml", "ngtemplates"],
    dist: ["ngmin"]
  },

  // swaps concat_sourcemap in place of vanilla concat
  appendTasks: {
    common: ["concat_sourcemap"]
  },

  // configuration for grunt-haml
  haml: {
    pages: {
      files: [
        {
          expand: true,
          cwd: "app/pages",
          src: ["**/*.haml"],
          dest: "generated/",
          ext: ".html"
        },
      ]
    },
    templates: {
      files: [
        {
          expand: true,
          cwd: "app/templates",
          src: ["**/*.haml"],
          dest: "generated/angular/templates/",
          ext: ".html"
        },
      ]
    }
  },

  // configuration for grunt-angular-templates
  ngtemplates: {
    app: { // "app" matches the name of the angular module defined in app.js
      options: {
        prefix: "/app/templates"
      },
      cwd: "generated/angular/templates",
      src: "**/*.html",
      dest: "generated/angular/template-cache.js"
    }
  },

  // configuration for grunt-ngmin, this happens _after_ concat once, which is the ngmin ideal :)
  ngmin: {
    js: {
      src: "<%= files.js.concatenated %>",
      dest: "<%= files.js.concatenated %>"
    }
  },

  // generates a sourcemap for js, specs, and css with inlined sources
  // grunt-angular-templates expects that a module already be defined to inject into
  // this configuration orders the template inclusion _after_ the app level module
  concat_sourcemap: {
    options: {
      sourcesContent: true
    },
    js: {
      src: ["<%= files.js.vendor %>", "<%= files.coffee.generated %>", "<%= files.js.app %>", "<%= files.ngtemplates.dest %>"],
      dest: "<%= files.js.concatenated %>"
    },
    spec: {
      src: ["<%= files.js.specHelpers %>", "<%= files.coffee.generatedSpecHelpers %>", "<%= files.js.spec %>", "<%= files.coffee.generatedSpec %>"],
      dest: "<%= files.js.concatenatedSpec %>"
    },
    css: {
      src: ["<%= files.less.generatedVendor %>", "<%= files.sass.generatedVendor %>", "<%= files.css.vendor %>", "<%= files.less.generatedApp %>", "<%= files.sass.generatedApp %>", "<%= files.css.app %>"],
      dest: "<%= files.css.concatenated %>"
    }
  },

  // configures grunt-watch-nospawn to listen for changes to
  // and recompile angular templates, also swaps lineman default
  // watch target concat with concat_sourcemap
  watch: {
    pages: {
      files: ["<%= files.pages.source %>"],
      tasks: ["haml:pages"]
    },
    ngtemplates: {
      files: "app/templates/**/*.haml",
      tasks: ["haml:templates", "ngtemplates", "concat_sourcemap:js"]
    },
    js: {
      files: ["<%= files.js.vendor %>", "<%= files.js.app %>"],
      tasks: ["concat_sourcemap:js"]
    },
    coffee: {
      files: "<%= files.coffee.app %>",
      tasks: ["coffee", "concat_sourcemap:js"]
    },
    jsSpecs: {
      files: ["<%= files.js.specHelpers %>", "<%= files.js.spec %>"],
      tasks: ["concat_sourcemap:spec"]
    },
    coffeeSpecs: {
      files: ["<%= files.coffee.specHelpers %>", "<%= files.coffee.spec %>"],
      tasks: ["coffee", "concat_sourcemap:spec"]
    },
    css: {
      files: ["<%= files.css.vendor %>", "<%= files.css.app %>"],
      tasks: ["concat_sourcemap:css"]
    },
    less: {
      files: ["<%= files.less.vendor %>", "<%= files.less.app %>"],
      tasks: ["less", "concat_sourcemap:css"]
    },
    sass: {
      files: ["<%= files.sass.vendor %>", "<%= files.sass.app %>"],
      tasks: ["sass", "concat_sourcemap:css"]
    }
  }

});
