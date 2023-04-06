let express = require("express");
let router = express.Router();
let Job = require('../models/job-DB')
let Notification = require('../models/noti-DB')
let {isLoggedIn, isAdmin} = require('../middlewares/index')
router.get("/", function (req, res) {
  res.render("landing");
});

//*Index
router.get("/jobs", async function (req, res) {
  //extract all jobs fron data base
  try {
      let foundJobs = await Job.find({});
      res.render('index', {foundJobs});
  } catch (error) {
    console.log('error while extracting all jobs', error);
  }
});

//new
router.get('/jobs/new', isLoggedIn, isAdmin ,function(req, res){
    res.render('new');
});

//create
router.post('/jobs', isLoggedIn, isAdmin ,async function(req, res){
    
    try {
        let newJob = new Job({
            name : req.body.name,
            address : req.body.address,
            image : req.body.image,
            package:req.body.package,
            cgpa:req.body.cgpa,
            deadline:req.body.deadline,
            type:req.body.type
        })
        await newJob.save();
        //push a new notification
        let newNotif = new Notification({
            body : 'A new job has been posted',
            author : newJob.name
        })
        await newNotif.save();
        res.redirect(`/jobs`)
        
    } catch (error) {
        
        console.log('error while extracting all jobs', error);
    }
})

//show
router.get('/jobs/:id', async function(req, res){
    try {
        let id = req.params.id;
        let job = await Job.findById(id);
        res.render('show', {job});
    } catch (error) {
        console.log('error while extracting all jobs', error);
    }
})

//edit
router.get('/jobs/:id/edit',isLoggedIn, isAdmin , async function(req, res){
    try {
        let id = req.params.id;
        let job = await Job.findById(id);
        res.render('edit', {job});
    } catch (error) {
        console.log('error while editing jobs', error);
    }
});

//update
router.patch('/jobs/:id', isLoggedIn, isAdmin ,async function(req, res){
    try {
        let id = req.params.id;
        //object banao for updatd job
        //this is javscript object
        let updateJob = {
            name : req.body.name,
            address : req.body.address,
            image : req.body.image,
            package:req.body.package,
            cgpa:req.body.cgpa,
            deadline:req.body.deadline,
            type:req.body.type
        };
        await Job.findByIdAndUpdate(id, updateJob);
        let newNotif = new Notification({
            body : 'A new job has been posted',
            author : newJob.name
        })
        await newNotif.save();
        res.redirect(`/jobs/${id}`);
    } catch (error) {
        console.log('error while updating job', error);
    }
})

//delete
router.delete('/jobs/:id', isLoggedIn, isAdmin ,async function(req, res){
    try {
        let id = req.params.id;
        await Job.findByIdAndDelete(id);
        res.redirect('/jobs')
    } catch (error) {
        console.log('error while deleting job', error);
    }
})


//apply jobs

router.get('/jobs/:jobId/apply', isLoggedIn, async function(req, res){
    try {
        if(!req.user.cgpa){
            return res.send('You have not entered CGPA')
        }
        let { jobId } = req.params
        let job = await Job.findById(jobId)
        if(req.user.cgpa < job.cgpa){
            return res.send('Your CGPA is not enough')
        }

        for(let user of job.appliedUsers)
        {
            if(user._id.equals(req.user._id)){
                return res.send('you can only apply once')
            }
        }
        job.appliedUsers.push(req.user);
        await job.save();
        res.redirect(`/jobs/${jobId}`)
    } catch (error) {
        console.log('error while applying in job', error)
    }
})
module.exports = router;