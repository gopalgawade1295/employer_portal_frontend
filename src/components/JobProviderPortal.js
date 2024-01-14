import React, { useEffect, useState } from 'react'
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Dialog } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import Alert from '@mui/joy/Alert';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

function JobProviderPortal() {
    const [data, setData] = useState({
        company_name: "",
        user: "",
        email: "",
        mobile: "",
        state: "",
        district: "",
        taluka: "",
        address: "",
        pincode: ""
    })
    const [list, setList] = useState([])
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [message, setMessage] = useState("");
    const [flag, setFlag] = useState(0);
    const location = useLocation()
    const navigate = useNavigate()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    const [jobTitle, setJobTitle] = useState("");
    const [jobCount, setJobCount] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [postID, setPostID] = useState("")

    const handleClose = () => {
        setOpen(false);
    };

    const FetchCompanies = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/mycompany/',
                {
                    email: userInfo?.email
                })
            const data = await res?.data
            console.log(data)
            setData({
                uid: data?.data?.companyname,
                company_name: data?.data?.companyname,
                user: data?.data?.name,
                email: data?.data?.email,
                mobile: data?.data?.mobile,
                state: data?.data?.state,
                district: data?.data?.district,
                taluka: data?.data?.taluka,
                address: data?.data?.address,
                pincode: data?.data?.pincode
            })
            sessionStorage.setItem("companyreq", data?.data?.uid)
            sessionStorage.setItem("companynew", data?.data?.companynew)
        }
        catch (err) {
            console.log(err)
        }
    }

    const FetchPosts = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/company/myposts/',
                {
                    user: userInfo?.id
                })
            const data = await res?.data
            setList(data?.data?.map((v) => {
                return {
                    id: v.uid,
                    Title: v.jobname,
                    Description: v.description,
                    'No. of Posts': v.count
                }
            }))
        }
        catch (err) {
            console.log(err)
        }
    }

    const PostJob = async () => {
        try {
            setFlag(3)
            setOpen(true);
            const res = await axios.post(
                `http://127.0.0.1:8000/company/createpost/`,
                {
                    companyreq: sessionStorage.getItem("companyreq"),
                    companynew: sessionStorage.getItem("companynew"),
                    jobname: jobTitle,
                    description: jobDescription,
                    count: jobCount === "" ? 0 : jobCount,
                    user: userInfo?.id
                }
            );
            FetchPosts()
            setShow(false)
            setJobTitle("")
            setJobCount("")
            setJobDescription("")

            setTimeout(() => {
                setOpen(false)
                setMessage("");
                setFlag(0);
            }, [2000])

            const data = await res.data

            setMessage("Posted successfully!")
            setFlag(2)
            setOpen(true);

            setTimeout(() => {
                setOpen(false);
                setMessage("");
                setFlag(0);
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
            }, [2000])
        }
    }

    const EditJob = async () => {
        try {
            setFlag(3)
            setOpen(true);
            const res = await axios.patch(
                `http://127.0.0.1:8000/company/edit/`,
                {
                    uid: postID,
                    jobname: jobTitle,
                    description: jobDescription,
                    count: jobCount === "" ? 0 : jobCount
                }
            );
            FetchPosts()
            setShow1(false)
            setPostID("")
            setJobTitle("")
            setJobCount("")
            setJobDescription("")

            setTimeout(() => {
                setOpen(false)
                setMessage("");
                setFlag(0);
            }, [2000])

            const data = await res.data

            setMessage("Updated successfully!")
            setFlag(2)
            setOpen(true);

            setTimeout(() => {
                setOpen(false);
                setMessage("");
                setFlag(0);
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
            }, [2000])
        }
    }

    const DeleteJob = async (id) => {
        try {
            setFlag(3)
            setOpen(true);
            console.log(id)
            await axios.delete(`http://127.0.0.1:8000/company/delete/${id}`);
            FetchPosts()
            setPostID("")

            setTimeout(() => {
                setOpen(false)
                setMessage("");
                setFlag(0);
            }, [2000])

            setMessage("Deleted successfully!")
            setFlag(2)
            setOpen(true);

            setTimeout(() => {
                setOpen(false);
                setMessage("");
                setFlag(0);
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
            }, [2000])
        }
    }

    useEffect(() => {
        FetchCompanies()
        FetchPosts()
    }, [])

    const Logout = () => {
        sessionStorage.removeItem('userInfo')
        sessionStorage.removeItem('companyreq')
        sessionStorage.removeItem('companynew')
        navigate('/')
    }

    return (
        <div>
            <Box sx={{ p: 2, textAlign: 'right', background:'#FDEBD0' }}>
                <Button
                    variant="outlined"
                    sx={{ m: 1, width: '100px', color: '#FF7900', border: '1px solid #FF7900', '&:hover': { border: '1px solid #FF7900', background: '#FFFFFF' } }}
                    onClick={() => Logout()}
                >
                    Logout
                </Button>
            </Box>

            <Box sx={{ p: 2, textAlign: 'left' }}>
                <Typography level="body-md" sx={{ mb: 0.5 }}>
                    Company Name: {data.company_name}
                </Typography>

                <Typography level="body-md" sx={{ mb: 0.5 }}>
                    User Name: {data.user}
                </Typography>

                <Typography level="body-md" sx={{ mb: 0.5 }}>
                    Email: {data.email}
                </Typography>

                <Typography level="body-md" sx={{ mb: 0.5 }}>
                    Mobile: {data.company_name}
                </Typography>

                <Typography level="body-md" sx={{ mb: 0.5 }}>
                    Address: {data.address}, {data.pincode}, {data.taluka}, {data.district}, {data.state}, India.
                </Typography>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="solid"
                    sx={{ m: 1, width: '200px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
                    onClick={() => setShow(true)}
                >
                    Create Post
                </Button>
            </Box>

            <Box sx={{ p: 2, textAlign: 'left', maxWidth: '1000px' }}>
                <DataGrid
                    columns={[
                        { field: 'Title', width: 200 },
                        { field: 'Description', width: 400 },
                        { field: 'No. of Posts', width: 200 },
                        {
                            field: 'Action', width: 200,
                            renderCell: (params) => (
                                <Box sx={{ display: 'flex' }}>
                                    <EditIcon
                                        sx={{ '&:hover': { cursor: 'pointer' }, color: '#27AE60', m: 1 }}
                                        onClick={() => {
                                            setShow1(true)
                                            console.log(params)
                                            setPostID(params?.row?.id);
                                            setJobTitle(params?.row?.Title);
                                            setJobCount(params?.row['No. of Posts']);
                                            setJobDescription(params?.row?.Description)
                                        }}
                                    />

                                    <DeleteOutlineIcon
                                        sx={{ '&:hover': { cursor: 'pointer' }, color: '#E74C3C', m: 1 }}
                                        onClick={() => DeleteJob(params?.row?.id)}
                                    />
                                </Box>
                            ),
                        }
                    ]}
                    rows={list}
                />
            </Box>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={show1}
                onClose={() => {
                    setShow1(false);
                    setJobTitle("");
                    setJobCount("");
                    setJobDescription("");
                    setPostID("");
                }}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        minWidth: 350,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Create Job Post
                    </Typography>

                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                            Job Title
                        </Typography>

                        <Input
                            type='text'
                            color="neutral"
                            size="sm"
                            placeholder="Enter Job Title"
                            sx={{ background: '#FFFFFF' }}
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mb: 1 }}>
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
                            value={jobCount}
                            onChange={(e) => setJobCount(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                            Job Description
                        </Typography>

                        <Textarea
                            minRows={3}
                            size="sm"
                            placeholder="Enter Job Description"
                            sx={{ background: '#FFFFFF' }}
                            name="description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="solid"
                            sx={{ m: 1, width: '100px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
                            onClick={() => EditJob()}
                        >
                            Update
                        </Button>
                    </Box>
                </Sheet>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={show}
                onClose={() => {
                    setShow(false);
                    setJobTitle("");
                    setJobCount("");
                    setJobDescription("");
                }}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        minWidth: 350,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Create Job Post
                    </Typography>

                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                            Job Title
                        </Typography>

                        <Input
                            type='text'
                            color="neutral"
                            size="sm"
                            placeholder="Enter Job Title"
                            sx={{ background: '#FFFFFF' }}
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mb: 1 }}>
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
                            value={jobCount}
                            onChange={(e) => setJobCount(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography level="body-md" sx={{ mb: 0.5 }}>
                            Job Description
                        </Typography>

                        <Textarea
                            minRows={3}
                            size="sm"
                            placeholder="Enter Job Description"
                            sx={{ background: '#FFFFFF' }}
                            name="description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="solid"
                            sx={{ m: 1, width: '100px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
                            onClick={() => PostJob()}
                        >
                            Add
                        </Button>
                    </Box>
                </Sheet>
            </Modal>

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

export default JobProviderPortal
