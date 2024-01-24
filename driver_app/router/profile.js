const express = require('express')
const multer = require('multer')

const { Profile } = require('../../models/driver/profile')
const { Driver }  = require('../../models/driver/driver')

const storage = multer.memoryStorage()
const upload = multer({
    dest: 'uploads/',
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file.'));
        }
        cb(undefined, true);
    }
})

class ProfileRoutes {
    constructor () {
        this.router = express.Router()

        this.setupRoutes()
    }

    setupRoutes () {
        this.router.get('/:id', this.getProfile)
        this.router.post('/', upload.single('picture'), this.addProfile)
        this.router.put('/update/:id', upload.single('picture'), this.updateProfile)
    }

    async getProfile (req, res, next) {
        try{
            const profile = await Profile.findOne({driver: req.params.id}).populate('driver')

            if (!profile) throw 'NotFound'

            res.status(200).send(profile) 
        } catch (error) {
            next(error)
        }
    }

    async addProfile(req, res, next) {
        try {
          const { driver, carModel, licensePlate } = req.body;
          const existingProfile = await Profile.findOne({driver}).populate('driver')
          if (!req.file) {
            throw 'NoFileError';
          }

          const { buffer } = req.file; // Access the buffer property

          if (!driver || !carModel || !licensePlate) {
            throw 'MissingFields';
          } else if (existingProfile) {
            const updatedProfile = await Profile.findByIdAndUpdate(
              existingProfile.id,
              {
                driver: existingProfile.driver.id,
                picture: buffer,
                carModel, 
                licensePlate,
              },
              {new: true}
            )
              if (!updatedProfile) {
                throw 'UpdateFail'
              }
              return res.send(updatedProfile)
          }
    
    
          let profile = new Profile({
            driver,
            picture: buffer,
            carModel,
            licensePlate,
          });
    
          profile = await profile.save();
    
          res.status(201).send(profile);
        } catch (error) {
          next(error);
        }
    }

    async updateProfile () {
      try {
        const oldItemID = req.params.id
        const { picture, carModel, licensePlate } = req.body
        const { buffer } = req.file;
        const profile = await Profile.findOneAndUpdate(
          oldItemID,
          {
            driver,
            picture: buffer,
            carModel,
            licensePlate
          },
          {new: true}
        )

        if (!profile)  throw 'NotFound'

        res.send(profile)
      } catch (error) {
        next(error)
      }

    }
}

module.exports = new ProfileRoutes()