import Navbar from "../components/Navbar";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'title', label: 'Titre', minWidth: 170},
    { id: 'location', label: 'Location', minWidth: 100},
    { id: 'date', label: 'Date', minWidth: 50},
    { id: 'nmbApplication', label: 'Nombre candidature', minWidth: 50},
    { id: 'detail', label: 'Detail'},
  ];
  
  function createData(title, location, date, nmbApplication, detail) {
    return { title, location, date, nmbApplication, detail };
  }
  
  const rows = [
    createData('Développeur Fullstack', 'Paris', '22/10/2024', 42, 'voir plus'),
    createData('Développeur IA', 'Toulouse', '22/10/2024', 12, 'voir plus'),
    createData('Développeur Java', 'Bordeaux', '22/10/2024', 20, 'voir plus'),
    createData('Manager projet angular', 'Toulouse', '22/10/2024', 5, 'voir plus'),
    createData('Développeur IA', 'Marseille', '22/10/2024', 10, 'voir plus'),
    createData('Développeur Back end', 'Toulouse', '22/10/2024', 22, 'voir plus'),
    createData('Développeur Java', 'Bordeaux', '22/10/2024', 20, 'voir plus'),
    createData('Manager projet angular', 'Toulouse', '22/10/2024', 5, 'voir plus'),
    createData('Développeur IA', 'Marseille', '22/10/2024', 10, 'voir plus'),
    createData('Développeur Back end', 'Toulouse', '22/10/2024', 22, 'voir plus'),
    createData('Développeur Fullstack', 'Paris', '22/10/2024', 42, 'voir plus'),
    createData('Développeur IA', 'Toulouse', '22/10/2024', 12, 'voir plus'),
    createData('Développeur Java', 'Bordeaux', '22/10/2024', 20, 'voir plus'),
  ];

export default function Recruiter_offer() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
   
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Mes offres d'emploi publiées</h1>
                <div className="table">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={0} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                            </TableCell>
                                            );
                                        })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </div>
        </div>
    );
  }