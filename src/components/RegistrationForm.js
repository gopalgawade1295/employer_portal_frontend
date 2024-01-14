import React, { useState } from 'react'
import { Box, Dialog } from '@mui/material'
import Input from '@mui/joy/Input';
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import Autocomplete from '@mui/joy/Autocomplete';
import CircularProgress from '@mui/joy/CircularProgress';
import Alert from '@mui/joy/Alert';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useFormik } from "formik";
import * as Yup from "yup";

const RegistrationForm = () => {
    const [show, setShow] = useState(false);
    const [companyID, setCompanyID] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [flag, setFlag] = useState(0);
    const [jobTitle, setJobTitle] = useState([
        {
            job_title: "",
            count: "",
            description: "",
        },
    ]);

    const addFields = (e) => {
        e.preventDefault();
        let newfield = {
            job_title: "",
            count: "",
            description: "",
        };
        setJobTitle([...jobTitle, newfield]);
    };

    const handleForm = (index, name, value) => {
        let data = [...jobTitle];
        data[index][name] = value;
        setJobTitle(data);
    };

    const removeField = (index) => {
        let data = [...jobTitle];
        data.splice(index, 1);
        setJobTitle(data);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formOne = useFormik({
        enableReinitialize: true,
        initialValues: {
            companyname: "",
            state: "",
            district: "",
            taluka: "",
            address: "",
            pincode: "",
            name: "",
            email: "",
            mobile: "",
        },
        validationSchema: Yup.object().shape({
            companyname: Yup.string().required("Please enter company name"),
            state: Yup.string().required("Please enter state"),
            district: Yup.string().required("Please enter district"),
            pincode: Yup.string()
                .notRequired()
                .length(6, "Pincode should be 6 digit")
                .matches(/^[0-9]+$/, "Must be only digits"),
            name: Yup.string().required("Please enter name"),
            email: Yup.string()
                .email("Please enter valid email")
                .required("Please enter email"),
            mobile: Yup.string()
                .required("Please enter mobile number")
                .length(10, "Mobile number should be 10 digit")
                .matches(/^[0-9]+$/, "Must be only digits"),
        }),

        onSubmit: async (values) => {
            try {
                setFlag(3)
                setOpen(true);

                const res = await axios.post(
                    `http://127.0.0.1:8000/company/register/`,
                    {
                        companyname: values.companyname,
                        state: values.state,
                        district: values.district,
                        taluka: values.taluka,
                        address: values.address,
                        pincode: Number(values.pincode),
                        name: values.name,
                        email: values.email,
                        mobile: String(values.mobile)
                    }
                );

                setTimeout(() => {
                    setOpen(false)
                    setMessage("");
                    setFlag(0);
                }, [2000])

                const data = await res.data
                setMessage("Registered successfully!")
                setFlag(2)
                setCompanyID(data?.data?.uid)
                setOpen(true);

                setTimeout(() => {
                    setOpen(false);
                    setMessage("");
                    setFlag(0);
                }, [2000])
                formOne.resetForm()
                setShow(true)

            } catch (err) {
                setMessage(err?.response?.data?.data)
                setFlag(1)
                setOpen(true);

                setTimeout(() => {
                    setOpen(false)
                    setMessage("");
                    setFlag(0);
                }, [2000])
            }
        },
    });

    const formTwo = async () => {
        try {
            setFlag(3)
            setOpen(true);
            const res = await axios.post(
                `http://127.0.0.1:8000/company/posts/`,
                {
                    id: companyID,
                    posts: jobTitle.map((v) => {
                        return (
                            {
                                jobname: v.job_title,
                                count: v.count === "" ? 0 : String(v.count),
                                description: v.description
                            }
                        )
                    })
                }
            );
            setJobTitle([
                {
                    job_title: "",
                    count: "",
                    description: "",
                },
            ]);

            setTimeout(() => {
                setOpen(false)
                setMessage("");
                setFlag(0);
                setCompanyID("");
            }, [2000])

            const data = await res.data

            setMessage("Posted successfully!")
            setFlag(2)
            setOpen(true);

            setTimeout(() => {
                setOpen(false);
                setMessage("");
                setFlag(0);
                setShow(false)
            }, [2000])
        }
        catch (err) {
            setMessage("Something went wrong!")
            setFlag(1)
            setOpen(true);

            setTimeout(() => {
                setOpen(false)
                setMessage("");
                setFlag(0);
                setCompanyID("");
                setShow(false)
            }, [2000])
        }
    }

    return (
        <div>
            <Typography level="h3" sx={{ m: 3, mb: 1 }}>
                Registration Form
            </Typography>
            <br />

            <Grid container sx={{ textAlign: 'left' }}>
                <Grid item lg={2.5} md={2} sm={1.5} xs={1.5} />

                <Grid item lg={7} md={8} sm={9} xs={9}>
                    <Box sx={{ p: 2 }} boxShadow={2}>
                        {show ?
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography level="title-lg" sx={{ mb: 0.5 }}>
                                        Add Job Posts
                                    </Typography>
                                </Grid>

                                {jobTitle.map((input, index) => {
                                    return (
                                        <>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography level="body-md" sx={{ mb: 0.5 }}>
                                                        Job Title
                                                    </Typography>

                                                    <Input
                                                        type='text'
                                                        color="neutral"
                                                        size="sm"
                                                        placeholder="Enter Job Title"
                                                        sx={{ background: '#FFFFFF' }}
                                                        value={input.job_title}
                                                        name="job_title"
                                                        onChange={(event) => {
                                                            handleForm(
                                                                index,
                                                                event.target.name,
                                                                event.target.value
                                                            );
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography level="body-md" sx={{ mb: 0.5 }}>
                                                        Number of Posts
                                                    </Typography>

                                                    <Input
                                                        type='number'
                                                        color="neutral"
                                                        size="sm"
                                                        placeholder="Enter Number of Posts"
                                                        sx={{ background: '#FFFFFF' }}
                                                        name="count"
                                                        value={input.count}
                                                        onChange={(event) => {
                                                            handleForm(
                                                                index,
                                                                event.target.name,
                                                                event.target.value
                                                            );
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography level="body-md" sx={{ mb: 0.5 }}>
                                                        Job Description
                                                    </Typography>

                                                    <Textarea
                                                        minRows={3}
                                                        size="sm"
                                                        placeholder="Enter Job Description"
                                                        sx={{ background: '#FFFFFF' }}
                                                        name="description"
                                                        value={input.description}
                                                        onChange={(event) => {
                                                            handleForm(
                                                                index,
                                                                event.target.name,
                                                                event.target.value
                                                            );
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                    {index > 0 && (
                                                        <Button
                                                            variant="outlined"
                                                            sx={{ m: 1, width: '100px', color: '#FF7900', border: '1px solid #FF7900', '&:hover': { border: '1px solid #FF7900', background: '#FFFFFF' } }}
                                                            onClick={() => removeField(index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}

                                                </Box>
                                            </Grid>
                                        </>
                                    )
                                })}

                                <Grid item xs={12}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="solid"
                                            sx={{ m: 1, width: '100px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
                                            onClick={(e) => addFields(e)}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="solid"
                                            sx={{ m: 1, width: '100px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
                                            onClick={() => formTwo()}
                                        >
                                            Submit
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            sx={{ m: 1, width: '100px', color: '#FF7900', border: '1px solid #FF7900', '&:hover': { border: '1px solid #FF7900', background: '#FFFFFF' } }}
                                            onClick={() => { setShow(false); formOne.handleReset() }}
                                        >
                                            Back
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid> :
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography level="title-lg" sx={{ mb: 0.5 }}>
                                        Company Details
                                    </Typography>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Company Name <sup style={{ color: 'red' }}>*</sup>
                                        </Typography>

                                        <Input
                                            type='text'
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Company Name"
                                            sx={{ background: '#FFFFFF' }}
                                            id="companyname"
                                            name="companyname"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.companyname}
                                        />

                                        {formOne.touched.companyname && formOne.errors.companyname ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.companyname}
                                            </Typography>
                                        ) : null}

                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            State <sup style={{ color: 'red' }}>*</sup>
                                        </Typography>

                                        <Autocomplete
                                            size="sm"
                                            placeholder="Select State"
                                            sx={{ background: '#FFFFFF' }}
                                            options={['Maharashtra']}
                                            id="state"
                                            name="state"
                                            onInputChange={(e, v) => {
                                                formOne.setFieldValue("state", v);
                                            }}
                                        />

                                        {formOne.touched.state && formOne.errors.state ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.state}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            District <sup style={{ color: 'red' }}>*</sup>
                                        </Typography>

                                        <Autocomplete
                                            size="sm"
                                            placeholder="Select District"
                                            sx={{ background: '#FFFFFF' }}
                                            options={['Mumbai', 'Thane', 'Raigad', 'Ratnagiri', 'Sindhudurg']}
                                            id="district"
                                            name="district"
                                            onInputChange={(e, v) => {
                                                formOne.setFieldValue("district", v);
                                            }}
                                        />


                                        {formOne.touched.district && formOne.errors.district ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.district}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Taluka
                                        </Typography>

                                        <Input
                                            type='text'
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Taluka"
                                            sx={{ background: '#FFFFFF' }}
                                            id="taluka"
                                            name="taluka"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.taluka}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Address
                                        </Typography>

                                        <Input
                                            type='text'
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Address"
                                            sx={{ background: '#FFFFFF' }}
                                            id="address"
                                            name="address"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.address}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Pincode
                                        </Typography>

                                        <Input
                                            type="number"
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Pincode"
                                            sx={{ background: '#FFFFFF' }}
                                            id="pincode"
                                            name="pincode"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.pincode}
                                        />

                                        {formOne.touched.pincode && formOne.errors.pincode ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.pincode}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography level="title-lg" sx={{ mb: 0.5 }}>
                                        Contact Details
                                    </Typography>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Name <sup style={{ color: 'red' }}>*</sup>
                                        </Typography>

                                        <Input
                                            type='text'
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Name"
                                            sx={{ background: '#FFFFFF' }}
                                            id="name"
                                            name="name"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.name}
                                        />

                                        {formOne.touched.name && formOne.errors.name ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.name}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Email <sup style={{ color: 'red' }}>*</sup>
                                        </Typography>

                                        <Input
                                            type='text'
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Email"
                                            sx={{ background: '#FFFFFF' }}
                                            id="email"
                                            name="email"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.email}
                                        />

                                        {formOne.touched.email && formOne.errors.email ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.email}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                                            Mobile Number <sup style={{ color: 'red' }}>*</sup>
                                        </Typography>

                                        <Input
                                            type='number'
                                            color="neutral"
                                            size="sm"
                                            placeholder="Enter Mobile Number"
                                            sx={{ background: '#FFFFFF' }}
                                            id="mobile"
                                            name="mobile"
                                            onChange={formOne.handleChange}
                                            value={formOne.values.mobile}
                                        />

                                        {formOne.touched.mobile && formOne.errors.mobile ? (
                                            <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                                {formOne.errors.mobile}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="solid"
                                            sx={{ m: 1, width: '100px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
                                            //onClick={() => { setShow(true); setOpen(true) }}
                                            onClick={() => formOne.handleSubmit()}
                                        >
                                            Submit
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            sx={{ m: 1, width: '100px', color: '#FF7900', border: '1px solid #FF7900', '&:hover': { border: '1px solid #FF7900', background: '#FFFFFF' } }}
                                            onClick={formOne.handleReset}
                                        >
                                            Clear
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        }
                    </Box>
                </Grid>

                <Grid item lg={2.5} md={2} sm={1.5} xs={1.5} />
            </Grid>
            <br />

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ minWidth: '250px', minHeight: '150px', p: 2, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box>
                        {flag === 0 ?
                            null :
                            flag === 1 ?
                                <ReportIcon fontSize='large' sx={{ color: '#E74C3C' }} /> :
                                flag === 2 ?
                                    <CheckCircleIcon fontSize='large' sx={{ color: '#27AE60' }} /> :
                                    <CircularProgress color="neutral" />
                        }
                        <br />

                        {flag === 0 ?
                            null :
                            flag === 1 ?
                                <Alert color="danger" variant="outlined">
                                    {message}
                                </Alert> :
                                flag === 2 ?
                                    <Alert color="success" variant="outlined">
                                        {message}
                                    </Alert> :
                                    <Alert color="neutral" variant="outlined">
                                        Submitting...
                                    </Alert>
                        }
                    </Box>
                </Box>
            </Dialog>
        </div>
    )
}

export default RegistrationForm
