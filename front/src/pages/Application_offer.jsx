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
    { id: 'nom', label: 'Nom', minWidth: 100},
    { id: 'prenom', label: 'Prenom', minWidth: 100},
    { id: 'offre', label: 'Offre', minWidth: 170},
    { id: 'date', label: 'Date', minWidth: 50},
    { id: 'statut', label: 'Statue', minWidth: 50},
    { id: 'score', label: 'score'},
  ];
  
  function createData(nom, prenom, offre, date, statut, score) {
    return { nom, prenom, offre, date, statut, score };
  }
  
  const rows = [
    createData('Onesti', 'Enzo', 'Developpeur fullstack', '22/10/2024', 'EN ATTENTE', '80%'),
    createData('Porter', 'Sam', 'Developpeur fullstack', '22/10/2024', 'EN ATTENTE', '72%'),
    createData('Drake', 'Nathan', 'Developpeur fullstack', '22/10/2024', 'ACCEPTÉ', '95%'),
    createData('De Riv', 'Geralt', 'Developpeur fullstack', '22/10/2024', 'REFUSÉE', '68%'),
    createData('Silverhand', 'Jhonny', 'Developpeur fullstack', '22/10/2024', 'EN ATTENTE', '82%'),
    createData('Acane', 'Jinx', 'Developpeur fullstack', '22/10/2024', 'REFUSÉE', '51%'),
  ];

export default function Application_offer() {
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
                                        style={{ minWidth: column.minWidth }}>
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