import fs from 'fs';
import path from 'path'
import _ from 'lodash'
import os from 'os'

class FileManagerController {
  static index(req, res, next) {
    try {
      let { dir } = req.query;
      if (!dir) {
        if (os.platform() === 'win32') {
          dir = 'C://'
        } else {
          dir = '/'
        }
      }
      const data = fs.readdirSync(dir);
      let files = [];
      data.forEach(file => {
        try {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          files.push({
            name: file,
            lName: file.toLowerCase(),
            isDirectory: stat.isDirectory(),
            path: filePath,
          })
        } catch (e) {
          //
        }
      })
      files = _.orderBy(files, ['isDirectory', 'lName'], ['desc', 'asc'])

      res.render('file-manager/index', {
        files,
        dir,
        backFolder: path.join(dir, '..'),
      })
    } catch (e) {
      next(e);
    }
  }

  static edit(req, res, next) {
    try {
      const { file } = req.query;
      let content
      try {
        content = fs.readFileSync(file);
      } catch (e) {
        content = '';
      }

      res.render('file-manager/edit', {
        content,
        file,
      })

    } catch (e) {
      next(e);
    }
  }

  static editSave(req, res, next) {
    try {
      const { content, file } = req.body;
      fs.writeFileSync(file, content)
      const dir = path.dirname(file);
      res.redirect('/file?dir=' + dir)
    } catch (e) {
      next(e);
    }
  }

  static deleteFile(req, res, next) {
    try {
      const { deleteFile } = req.body;
      if (fs.existsSync(deleteFile)) {
        const stat = fs.statSync(deleteFile);
        if (stat.isDirectory()) {
          fs.rmdirSync(deleteFile, { recursive: true })
        } else {
          fs.unlinkSync(deleteFile)
        }
      }

      res.redirect('/file?dir=' + path.join(deleteFile, '..'))
    } catch (e) {
      next(e);
    }
  }

  static renameFile(req, res, next) {
    try {
      const { filePath, newName } = req.body;
      fs.renameSync(filePath, path.join(filePath, '..', newName))
      res.redirect('/file?dir=' + path.join(filePath, '..'))
    } catch (e) {
      next(e);
    }
  }
}

export default FileManagerController;

