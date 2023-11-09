const Division = require('../model/Division');
const User = require('../model/User');

const getAllUser = async(req, res, next)=>{
  try {
    //TUGAS NOMOR 1
    const userAll = await User.findAll({
      include: [{
        model: Division,
        attributes: ['name'],
       }],
       attributes: ['id', 'fullName','angkatan']
    });

    if(userAll==undefined){
      res.status(400).json({
        status: "Error",
        message: "failed to get data"
      })
    }

    res.status(201).json({
      status: "success",
      message: "Successfuly get all User data",
      user :{
        userAll
      }
    })

  } catch (error) {
    console.log(error.message);
  }
}

const getUserById = async(req,res,next)=>{
  try {
    //TUGAS NOMOR 2 cari user berdasarkan userId
    const {userId} = req.params

    const userById = await User.findOne({
      where:{id:userId},
      include: [{
        model: Division,
        attributes: ['name'],
       }],
       attributes: ['id', 'fullName','angkatan']
    });

    if(userById === null){
      res.status(400).json({
        status: "Error",
        message: `User with id ${userId} is not existed!`
      })
    }

    res.status(201).json({
      status: "success",
      message: "Successfuly get user by id",
      user :{
        userById
      }
    })
  } catch (error) {
    console.log(error.message);
  }
}

const postUser = async(req,res,next)=>{
  try {
    const {
      fullName, nim, angkatan, email, password, division
    } = req.body

    //cari divisi id
    //pakai await untuk menghindari penulisan then
    const user_division = await Division.findOne({
      where:{
        name: division
      }
    });

    //SELECT * FROM DIVISION WHERE name = division
    if(user_division == undefined){
      res.status(400).json({
        status: "Error",
        message: `${division} is not existed`
      })
    }

    //insert data ke tabel User
    const currentUser = await User.create({
      //nama field: data
      fullName: fullName,
      //jika nama field == data maka bisa diringkas
      email,
      password,
      angkatan,
      nim,
      divisionId: user_division.id
    })

    //send response
    res.status(201).json({
      status: "success",
      message: "Successfuly create User",
      user: {
        fullName: currentUser.fullName,
        division: currentUser.division
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const deleteUser = (req,res,next)=>{
  try {
    const {userId} = req.params;

    //mencari index user dari array model user
    const targetedIndex = User.findIndex((element)=>{
      return element.id == userId
    })

    //user tidak ketemu
    if(targetedIndex === -1){
      res.status(400).json({
        status: "Error",
        message: `User with id ${userId} is not existed`
      })
    }

    //hapus array pada [targetedIndex] sebanyak 1 buah element
    User.splice(targetedIndex, 1);

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user"
    })
  } catch (error) {
    console.log(error.message);
  }
}

//Membatasi akses pengguna terhadap url yang tidak diinginkan
const pageHandler = (req,res,next)=>{
  res.status(400).json({
    status: "Error",
    message: "Page Not Found"
  })
}

module.exports = {
  getAllUser, getUserById, postUser, deleteUser, pageHandler
}