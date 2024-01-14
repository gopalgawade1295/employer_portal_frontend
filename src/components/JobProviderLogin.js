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
import { Link, useNavigate } from 'react-router-dom';

const JobProvider = () => {
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

    const navigate = useNavigate()

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
            email: "",
            password: "",
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email("Please enter valid email")
                .required("Please enter email"),
            password: Yup.string()
                .required("Please enter password")
        }),

        onSubmit: async (values) => {
            try {
                setFlag(3)
                setOpen(true);

                const res = await axios.post(
                    `http://127.0.0.1:8000/user/login/`,
                    {
                        name: values.email,
                        email: values.email,
                        username: values.email,
                        password: values.password
                    }
                );

                setTimeout(() => {
                    setOpen(false)
                    setMessage("");
                    setFlag(0);
                }, [2000])

                const data = await res.data
                console.log(data, 'aaa')
                sessionStorage.setItem('userInfo', JSON.stringify(data))
                setMessage("Login successfully!")
                setFlag(2)
                setOpen(true);
                navigate('/jobproviderportal')

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

    return (
        <div>
            <Typography level="h3" sx={{ m: 3, mb: 1 }}>
                Employer Login
            </Typography>
            <br />

            <Grid container sx={{ textAlign: 'left' }}>
                <Grid item lg={4} md={4} sm={1.5} xs={1.5} />

                <Grid item lg={4} md={4} sm={9} xs={9}>
                    <Box sx={{ p: 2 }} boxShadow={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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

                            <Grid item xs={12}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography level="body-md" sx={{ mb: 0.5 }}>
                                        Password <sup style={{ color: 'red' }}>*</sup>
                                    </Typography>

                                    <Input
                                        type='password'
                                        color="neutral"
                                        size="sm"
                                        placeholder="Enter Password"
                                        sx={{ background: '#FFFFFF' }}
                                        id="password"
                                        name="password"
                                        onChange={formOne.handleChange}
                                        value={formOne.values.password}
                                    />

                                    {formOne.touched.password && formOne.errors.password ? (
                                        <Typography color="danger" level="body-xs" sx={{ mb: 0.5, mt: 0.5 }}>
                                            {formOne.errors.password}
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
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Link to={'/jobprovider'}>
                                    <Typography level="body-md" sx={{ mb: 0.5 }}>
                                        New user? Go to Registration page
                                    </Typography>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item lg={4} md={4} sm={1.5} xs={1.5} />
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

export default JobProvider
