module.exports = (grunt, options) => {

  var project = options.project;
  var helpers = options.helpers;

  return {
    build: {
      cwd: project.dir,
      src: [
        '**/*.*',
        `!${project.res.templates.dir.replace(project.dir, '')}/**`,
        `!${project.res.css.sass.replace(project.dir, '')}/**`,
        ...helpers.dontCopy,
        ...helpers.sprites
      ],
      dest: project.build.dir,
      expand: true
    },
    meta: {
      cwd: project.meta,
      src: ['**/*.*'],
      dest: project.build.dir,
      expand: true
    },
    dist: {
      cwd: project.res.js.comp,
      src: `${project.res.js.name}.js`,
      dest: project.build.dist,
      expand: true
    }
  };

};
