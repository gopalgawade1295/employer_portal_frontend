import React, { useEffect, useState } from 'react'
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import moment from 'moment';
import Snackbar from '@mui/joy/Snackbar';
import { keyframes } from '@mui/system';
import Badge from '@mui/joy/Badge';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

function SuperAdmin() {
    const [list, setList] = useState([])
    const [list1, setList1] = useState([])
    const [list2, setList2] = useState([])
    const [message, setMessage] = useState("")
    const [data, setData] = useState(
        {
            total: 0,
            accepted: 0,
            deactivated: 0,
            companies: 0,
            notapprove: 0
        }
    )
    const navigate = useNavigate()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    const [open, setOpen] = React.useState(false);
    const animationDuration = 600;

    const handleClose = () => {
        setOpen(false);
        setMessage("")
    };

    const Overview = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/overview/')
            const data = await res?.data
            console.log(data)
            setData({
                total: data?.Total,
                accepted: data?.Accepted,
                deactivated: data?.Deactivated,
                companies: data?.Request_Accepted,
                notapprove: data?.New_Requests
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    console.log(data, 'xv')

    const FetchPosts = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/companies/')
            const data = await res?.data
            setList(data?.companies?.map((v) => {
                return {
                    id: v.uid,
                    'Company Name': v.companyname,
                    State: v.state,
                    District: v.district,
                    Taluka: v.taluka,
                    Address: v.address,
                    Pincode: v.pincode,
                    Name: v.name,
                    Email: v.email,
                    Mobile: v.mobile,
                    'Registration Date': v.createdAt ? moment(v.createdAt).format('DD-MM-YYYY') : "",
                    Status: v.isVerified
                }
            }))
        }
        catch (err) {
            console.log(err)
        }
    }

    const FetchPosts1 = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/companies/notapproved/')
            const data = await res?.data
            setList1(data?.companies?.map((v) => {
                return {
                    id: v.uid,
                    'Company Name': v.companyname,
                    State: v.state,
                    District: v.district,
                    Taluka: v.taluka,
                    Address: v.address,
                    Pincode: v.pincode,
                    Name: v.name,
                    Email: v.email,
                    Mobile: v.mobile,
                    'Registration Date': v.createdAt ? moment(v.createdAt).format('DD-MM-YYYY') : "",
                    Status: v.isVerified
                }
            }))
        }
        catch (err) {
            console.log(err)
        }
    }

    const FetchPosts2 = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/companies/notinportal/')
            const data = await res?.data
            setList2(data?.data?.map((v) => {
                return {
                    id: v.uid,
                    'Company Name': v.companyname,
                    State: v.state,
                    District: v.district,
                    Taluka: v.taluka,
                    Address: v.address,
                    Pincode: v.pincode,
                    Name: v.name,
                    Email: v.email,
                    Mobile: v.mobile,
                    'Registration Date': v.createdAt ? moment(v.createdAt).format('DD-MM-YYYY') : "",
                    Status: v.isVerified
                }
            }))
        }
        catch (err) {
            console.log(err)
        }
    }


    const ChangeUserStatus = async (email) => {
        try {
            const res = await axios.patch('http://127.0.0.1:8000/user/approve/',
                {
                    user: userInfo?.id,
                    email: email
                })
            const data = await res?.data
            setMessage(data?.data)
            FetchPosts()
            setOpen(true)
            Overview()
        }
        catch (err) {
            setMessage("Something went wrong!")
            setOpen(true)
        }
    }

    const ChangeUserStatus1 = async (email) => {
        try {
            const res = await axios.patch('http://127.0.0.1:8000/company/approve/',
                {
                    user: userInfo?.id,
                    email: email
                })
            const data = await res?.data
            setMessage(data?.data)
            FetchPosts()
            FetchPosts1()
            FetchPosts2()
            setOpen(true)
            Overview()
        }
        catch (err) {
            setMessage("Something went wrong!")
            setOpen(true)
        }
    }

    useEffect(() => {
        FetchPosts()
        FetchPosts1()
        FetchPosts2()
        Overview()
    }, [])

    const Logout = () => {
        sessionStorage.removeItem('userInfo')
        navigate('/')
    }

    return (
        <div>
            <Box sx={{ p: 2, textAlign: 'right', background: '#FDEBD0' }}>
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
                    Email: {userInfo.username}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', maxWidth: '1200px', ml: 'auto', mr: 'auto' }}>
                <Badge badgeContent={data?.total === 0 ? "0" : data?.total} sx={{ m: 2 }}>
                    <Typography level="body-md" sx={{ background: '#D6EAF8', width: '300px', p: 1 }}>
                        Total Company Portals&nbsp;&nbsp;
                    </Typography>
                </Badge>

                <Badge badgeContent={data?.accepted === 0 ? "0" : data?.accepted} color="success" sx={{ m: 2 }}>
                    <Typography level="body-md" sx={{ background: '#ABEBC6', width: '300px', p: 1 }}>
                        Total Active Portals&nbsp;&nbsp;
                    </Typography>
                </Badge>

                <Badge badgeContent={data?.deactivated === 0 ? "0" : data?.deactivated} color="danger" sx={{ m: 2 }}>
                    <Typography level="body-md" sx={{ background: '#FADBD8', width: '300px', p: 1 }}>
                        Total Deactive Portals&nbsp;&nbsp;
                    </Typography>
                </Badge>

                <Badge badgeContent={data?.companies === 0 ? "0" : data?.companies} sx={{ m: 2 }}>
                    <Typography level="body-md" sx={{ background: '#D6EAF8', width: '300px', p: 1 }}>
                        Total Requests Approved&nbsp;&nbsp;
                    </Typography>
                </Badge>

                <Badge badgeContent={data?.notapprove === 0 ? "0" : data?.notapprove} color="danger" sx={{ m: 2 }}>
                    <Typography level="body-md" sx={{ background: '#FADBD8', width: '300px', p: 1 }}>
                        New Requests / Not Approved Yet&nbsp;&nbsp;
                    </Typography>
                </Badge>
            </Box>

            <Box sx={{ p: 2, textAlign: 'left', maxWidth: '100%' }}>
                <Typography level="body-lg" sx={{ p: 1 }}>
                    Company Portals
                </Typography>

                <DataGrid
                    columns={[
                        { field: 'Company Name', width: 200 },
                        { field: 'State', width: 200 },
                        { field: 'District', width: 200 },
                        { field: 'Taluka', width: 200 },
                        { field: 'Address', width: 400 },
                        { field: 'Pincode', width: 200 },
                        { field: 'Name', width: 200 },
                        { field: 'Email', width: 200 },
                        { field: 'Mobile', width: 200 },
                        { field: 'Registration Date', width: 200 },
                        {
                            field: 'Status', width: 200,
                            renderCell: (params) => (
                                <Select
                                    defaultValue={params?.row?.Status === true ? "Active" : "Deactive"}
                                    onChange={() => ChangeUserStatus(params?.row?.Email)}
                                    sx={{ width: '150px' }}
                                >
                                    <Option value="Active">Active</Option>
                                    <Option value="Deactive">Deactive</Option>
                                </Select>
                            ),
                        }
                    ]}
                    rows={list}
                />
            </Box>
            <br />

            <Box sx={{ p: 2, textAlign: 'left', maxWidth: '100%' }}>
                <Typography level="body-lg" sx={{ p: 1 }}>
                    New Requests / Not Approved Yet
                </Typography>

                <DataGrid
                    columns={[
                        { field: 'Company Name', width: 200 },
                        { field: 'State', width: 200 },
                        { field: 'District', width: 200 },
                        { field: 'Taluka', width: 200 },
                        { field: 'Address', width: 400 },
                        { field: 'Pincode', width: 200 },
                        { field: 'Name', width: 200 },
                        { field: 'Email', width: 200 },
                        { field: 'Mobile', width: 200 },
                        { field: 'Registration Date', width: 200 },
                        {
                            field: 'Status', width: 200,
                            renderCell: (params) => (
                                <Select
                                    defaultValue={params?.row?.Status === true ? "Active" : "Deactive"}
                                    onChange={() => ChangeUserStatus1(params?.row?.Email)}
                                    sx={{ width: '150px' }}
                                >
                                    <Option value="Active">Active</Option>
                                    <Option value="Deactive">Deactive</Option>
                                </Select>
                            ),
                        }
                    ]}
                    rows={list1}
                />
            </Box>

            <Box sx={{ p: 2, textAlign: 'left', maxWidth: '100%' }}>
                <Typography level="body-lg" sx={{ p: 1 }}>
                    Companies Not On Portals
                </Typography>

                <DataGrid
                    columns={[
                        { field: 'Company Name', width: 200 },
                        { field: 'State', width: 200 },
                        { field: 'District', width: 200 },
                        { field: 'Taluka', width: 200 },
                        { field: 'Address', width: 400 },
                        { field: 'Pincode', width: 200 },
                        { field: 'Name', width: 200 },
                        { field: 'Email', width: 200 },
                        { field: 'Mobile', width: 200 },
                        { field: 'Registration Date', width: 200 },
                        {
                            field: 'Status', width: 200,
                            renderCell: (params) => (
                                <Select
                                    defaultValue={params?.row?.Status === true ? "Active" : "Deactive"}
                                    onChange={() => ChangeUserStatus1(params?.row?.Email)}
                                    sx={{ width: '150px' }}
                                >
                                    <Option value="Active">Active</Option>
                                    <Option value="Deactive">Deactive</Option>
                                </Select>
                            ),
                        }
                    ]}
                    rows={list2}
                />
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                color={message?.includes("wrong") ? "danger" : "success"}
                variant="solid"
                open={open}
                onClose={handleClose}
                autoHideDuration={4000}
                animationDuration={animationDuration}
                sx={{
                    ...(open && {
                        animation: `${inAnimation} ${animationDuration}ms forwards`,
                    }),
                    ...(!open && {
                        animation: `${outAnimation} ${animationDuration}ms forwards`,
                    }),
                }}
            >
                {message}
            </Snackbar>
        </div>
    )
}

export default SuperAdmin
