import fs from "fs";
import _ from "lodash";
import validator from "validator";
import Validator from "validatorjs";
import Users from "../models/Users";
import md5 from "md5";
import HttpError from "http-errors";
import joi from "joi";
import path from "path";
import { use } from "express/lib/router";

class UsersController {
  static index = (req, res, next) => {
    try {
      res.render('users/index');
    } catch (e) {
      next(e)
    }
  }
  static login = (req, res, next) => {
    try {
      const { register, checked } = req.query;
      const { email, password } = req.body;

      const user = Users.getUser(email);
      const errors = {};

      if (user) {
        if (user.email === email && user.password === md5(md5(password) + '_safe')) {
          res.render('users/page', { data: { fName: user.fName, lName: user.lName } })
        } else {
          errors.password = ['Wrong password'];
        }
      } else {
        if (!checked) {
          errors.email = ['There is no user with such email'];
        }
      }


      res.render('users/login', { errors: errors ? errors : {}, data: { email }, register });
    } catch (e) {
      next(e)
    }
  }
  static loginPost = (req, res, next) => {
    try {
      const { register } = req.query;
      const { email, password } = req.body;

      const user = Users.getUser(email);
      const errors = {};

      const isLogin = user && user.password === md5(md5(password) + '_safe')

      if (isLogin) {
        req.session.email = email;
        res.redirect('/users/profile');
        return;
      } else {
        delete req.session.email;
      }

      errors.email = ['invalid login or password']

      res.render('users/login', { errors: errors ? errors : {}, data: { email }, register });
    } catch (e) {
      next(e)
    }
  }
  static registration = (req, res, next) => {
    try {
      res.render('users/registration', { errors: {}, data: {} });
    } catch (e) {
      next(e)
    }
  }
  static registrationPost = (req, res, next) => {
    try {
      const { fName, lName, email } = req.body;
      let { password } = req.body;
      let validation = new Validator(req.body, {
        email: 'required|email',
        fName: 'required|alpha|min:2',
        lName: 'required|alpha|min:2',
        password: 'required|min:6',
      });
      validation.passes();
      const { errors } = validation.errors;
      const existUser = Users.getUser(email);
      if (existUser) {
        errors.email = ['user already registered']
      }

      // const schema = joi.object({
      //   email: joi.string().trim().email().required(),
      //   fName: joi.string().required(),
      //   number: joi.array(joi.string())
      // })

      // const val = schema.validate(req.body);
      // console.log(val)

      password = md5(md5(password) + '_safe');
      if (_.isEmpty(errors)) {
        Users.createUser(email, { fName, lName, password });
        res.redirect('/users/login?register=1&checked=no')
        return
      }
      res.render('users/registration', { errors, data: req.body });
    } catch (e) {
      next(e)
    }
  }

  static profile = (req, res, next) => {
    try {

      const { email } = req.session;
      const user = Users.getUser(email);
      res.render('users/profile', { user });
    } catch (e) {
      next(e)
    }
  }
}

export default UsersController;
