const mongoose = require("mongoose");
const List = require("../models/list");
const router = require("express").Router();
const User = require("../models/user");

router.post("/create", async (req, res) => {
  try {
    const { title, description, id } = req.body;
    const exitstinguser = await User.findById(id);
    if (!exitstinguser) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const list = new List({ title, description, user: exitstinguser });
    await list.save();
    exitstinguser.list.push(list);
    await exitstinguser.save();
    const plainlist = list.toObject();
    console.log(plainlist);
    delete plainlist.user;
    res.status(200).json({
      list: plainlist,
      user: exitstinguser,
    });
  } catch (error) {
    res.status(400).json({
      message: "something unexpected happened",
      error: error.message,
    });
  }
});

router.put("/update/:_id", async (req, res) => {
  try {
    const { title, description } = req.body;

    await List.findByIdAndUpdate(req.params._id, { title, description });
    res.status(200).json({
      message: "Task Updated",
    });
  } catch (error) {
    res.status(400).json({
      message: "something unexpected happened",
      error: error.message,
    });
  }
});

router.delete("/delete/:_id", async (req, res) => {
  try {
    const { id } = req.body;
    const exitstinguser = await User.findByIdAndUpdate(id, {
      $pull: { list: req.params._id },
    });

    if (exitstinguser) {
      await List.findByIdAndDelete(req.params._id);

      return res.status(200).json({
        message: "Task deleted",
      });
    }
    res.status(400).json({
      message: "Nothing to delete",
    });
  } catch (error) {
    res.status(400).json({
      message: "something unexpected happened",
      error: error.message,
    });
  }
});

router.get("/getlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exitstinguser = await User.findById(id);

    if (exitstinguser) {
      const list = await List.find({ user: req.params.id });

      return res.status(200).json({
        list,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "something unexpected happened",
      error: error.message,
    });
  }
});

module.exports = router;
