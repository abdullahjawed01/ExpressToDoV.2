import express from "express"

import { readDB, writeDB, deleteDB } from "../../utils/helper.js"

import { v4 as uuid } from "uuid"
const router = express.Router()
// get all user


router.get("/getalluser", async (req, res) => {
    try {
        let data = await readDB()
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.statusCode(400).json({ msg: error })
    }
})

// get user by id
router.get("/getuserbyid/:id", async (req, res) => {
    try {
        let DB = await readDB()
        let user = DB.find((x) => x.id == req.params.id);
        console.log(user);
        res.status(200).json(user)

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error })
    }
})

// add task to user



router.post("/task", async (req, res) => {



    try {
        const { uid, taskname, taskDescription, deadline } = req.body;


        if (!uid || !taskname) {
            return res.status(400).json({ msg: "uid and taskname are required" });
        }

        let users = await readDB();

        const userIndex = users.findIndex(u => u.id === uid);

        if (userIndex === -1) {
            return res.status(404).json({ msg: "User not found" });
        }


        const newTask = {
            id: uuid(),
            taskname,
            taskDescription: taskDescription || "",
            isCompleted: false,
            deadline: deadline || null,
            createdAt: new Date().toISOString()
        };

        users[userIndex].task.push(newTask);


        await writeDB(users);

        return res.status(201).json({
            msg: "Task added successfully",
            task: newTask
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)

    }
})

// find task by id

router.get("/findtask/:id", async (req, res) => {
    try {
        let users = await readDB()
        let id = req.params.id
        const alltask = users.flatMap(u => u.task || []);

        let find = alltask.find(x => x.id === id)
        res.status(200).json(find)


    } catch (error) {
        console.log(error);
        res.status(200).json({ msg: error })
    }
})

// delete task by id

router.delete("/deletetaskbyid/:id", async (req, res) => {
    try {
        let users = await readDB();
        let taskId = req.params.id;


        let userIndex = users.findIndex(u => u.task?.some(t => t.uid === taskId));

        if (userIndex === -1) {
            return res.status(404).json({ msg: "Task not found" });
        }


        users[userIndex].task = users[userIndex].task.filter(t => t.uid !== taskId);


        await writeDB(users);

        res.status(200).json({ msg: "Task deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
});



// delete all task


router.delete("/deletealltask/:userid", async (req, res) => {
    try {
        let users = await readDB();
        let userId = req.params.userid;


        let userIndex = users.findIndex(u => u.id === userId);


        users[userIndex].task = [];

        await writeDB(users);

        res.status(200).json({ msg: "All tasks deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
});


// update user

router.put("/updateuser/:id", async (req, res) => {
    try {
        let DB = await readDB()
        let user = DB.find(x => x.id == req.params.id)
        let { name, email, phone, age, password } = req.body
        if (name !== undefined) user.name = name
        if (email !== undefined) user.email = email
        if (age !== undefined) user.age = age
        if (password !== undefined) user.password = password
        if (phone !== undefined) user.phone = phone

        await writeDB(DB)
        res.status(200).json({ msg: "User Updated succesfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
})
// router.put("/updateuser/:id", async (req, res) => {
//     try {
//         let existingdata = await readDB()
//         let updateuser = req.params.id

//         let change = existingdata.find(x => x.id == updateuser)

//         if (!change) {
//             return res.status(404).json({ msg: "user not found" })
//         }


//         const { name, age, email, phone, password } = req.body
//         if (name !== undefined) change.name = name
//         if (age !== undefined) change.age = Number(age)
//         if (email !== undefined) change.email = email
//         if (phone !== undefined) change.phone = phone
//         if (password !== undefined) change.fname = password
//         await writeDB(existingdata)

//         console.log(change)
//         res.status(200).json({ msg: "user updated", data: change })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json(error)
//     }
// })




// delete user by id
router.delete("/deleteuser/:id", async (req, res) => {
    try {
        let DB = await readDB()
        // let id = DB.find(x=>x.id == req.params.id)
        let newDB = DB.filter(x => x.id !== req.params.id)
        await writeDB(newDB)
        res.status(200).json({ msg: "Deleted user" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
})



// deleteall user


router.delete("/deletealluser", async (req, res) => {
    try {
        await writeDB([])
        res.status(200).json({ msg: `All user have been successfully deleted` })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
})






export default router