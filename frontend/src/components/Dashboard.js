import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaMoneyBillWave, FaUsers, FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [financeStats, setFinanceStats] = useState([]);
  const [chretienStats, setChretienStats] = useState([]);
  const [evenements, setEvenements] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/finances').then((res) => setFinanceStats(res.data)).catch((err) => console.error(err));
    axios.get('http://localhost:5000/api/stats/chretiens').then((res) => setChretienStats(res.data)).catch((err) => console.error(err));
    axios.get('http://localhost:5000/api/stats/evenements').then((res) => setEvenements(res.data)).catch((err) => console.error(err));
  }, []);

  // Graphique Finances (Entrant/Sortant)
  const financeChartData = {
    labels: financeStats.map((stat) => stat.eglise),
    datasets: [
      { label: 'Entrant (MGA)', data: financeStats.map((stat) => stat.entrant), backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
      { label: 'Sortant (MGA)', data: financeStats.map((stat) => stat.sortant), backgroundColor: 'rgba(255, 99, 132, 0.6)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 },
    ],
  };

  // Graphique Solde par Église
  const soldeChartData = {
    labels: financeStats.map((stat) => stat.eglise),
    datasets: [
      {
        label: 'Solde (MGA)',
        data: financeStats.map((stat) => stat.entrant - stat.sortant),
        backgroundColor: financeStats.map((stat) => (stat.entrant - stat.sortant >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)')),
        borderColor: financeStats.map((stat) => (stat.entrant - stat.sortant >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)')),
        borderWidth: 1,
      },
    ],
  };

  // Graphique Chrétiens
  const chretienChartData = {
    labels: chretienStats.map((stat) => stat.statut),
    datasets: [
      {
        label: 'Nombre de Chrétiens',
        data: chretienStats.map((stat) => stat.nombre),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Graphique Événements
  const eventChartData = {
    labels: evenements.map((e) => e.date_evenement),
    datasets: [
      {
        label: 'Événements',
        data: evenements.map(() => 1),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  // Exportation Excel pour Finances
  const handleExportFinanceExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      financeStats.map((stat) => ({
        Église: stat.eglise,
        'Entrant (MGA)': stat.entrant,
        'Sortant (MGA)': stat.sortant,
        'Solde (MGA)': (stat.entrant - stat.sortant).toFixed(2),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Finances');
    XLSX.writeFile(workbook, 'finances.xlsx');
  };

  // Exportation Excel pour Chrétiens
  const handleExportChretienExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(chretienStats);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chretiens');
    XLSX.writeFile(workbook, 'chretiens.xlsx');
  };

  // Exportation Excel pour Événements
  const handleExportEvenementExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(evenements);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evenements');
    XLSX.writeFile(workbook, 'evenements.xlsx');
  };

  return (
    <Container className="mt-4">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Tableau de bord
      </motion.h2>
      <Row className="mb-4">
        <Col md={6}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <Card.Header>
                <FaMoneyBillWave /> Finances par Église
                <Button variant="success" size="sm" className="float-end" onClick={handleExportFinanceExcel}>
                  <FaFileExcel /> Excel
                </Button>
              </Card.Header>
              <Card.Body>
                {financeStats.length > 0 ? (
                  <Bar data={financeChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Entrant/Sortant par Église' } } }} />
                ) : (
                  <p>Aucune donnée financière.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={6}>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <Card.Header>
                <FaMoneyBillWave /> Solde par Église
              </Card.Header>
              <Card.Body>
                {financeStats.length > 0 ? (
                  <Bar data={soldeChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Solde par Église' } } }} />
                ) : (
                  <p>Aucune donnée financière.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <Card.Header>
                <FaUsers /> Statistiques des Chrétiens
                <Button variant="success" size="sm" className="float-end" onClick={handleExportChretienExcel}>
                  <FaFileExcel /> Excel
                </Button>
              </Card.Header>
              <Card.Body>
                {chretienStats.length > 0 ? (
                  <Doughnut data={chretienChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Répartition des Chrétiens' } } }} />
                ) : (
                  <p>Aucune donnée.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={6}>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <Card.Header>
                <FaCalendarAlt /> Événements à venir
                <Button variant="success" size="sm" className="float-end" onClick={handleExportEvenementExcel}>
                  <FaFileExcel /> Excel
                </Button>
              </Card.Header>
              <Card.Body>
                {evenements.length > 0 ? (
                  <Line data={eventChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Événements (30 jours)' } } }} />
                ) : (
                  <p>Aucun événement.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
      <Row>
        <Col>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card>
              <Card.Header><FaCalendarAlt /> Liste des Événements à venir</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Chrétien</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evenements.map((event, index) => (
                      <tr key={index}>
                        <td>{event.type_evenement}</td>
                        <td>{event.date_evenement}</td>
                        <td>{event.description}</td>
                        <td>{event.chretien_nom} {event.chretien_prenom}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {evenements.length === 0 && <p>Aucun événement à venir.</p>}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;