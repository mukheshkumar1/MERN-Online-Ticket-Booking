import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import MovieScreen from './screens/MovieScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import Tickets from './screens/Tickets';
import SigninScreen from './screens/SigninScreen';
import BookingInfoScreen from './screens/BookingInfoScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceBookingScreen from './screens/PlaceBookingScreen';
import BookingScreen from './screens/BookingScreen';
import BookingHistoryScreen from './screens/BookingHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import MovieListScreen from './screens/MovieListScreen';
import MovieEditScreen from './screens/MovieEditScreen';
import BookingListScreen from './screens/BookingListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import TheatreList from './screens/Theatrelist';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ForgetPasswordScreen from './screens/ForgotPaswword';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, tinfo, userInfo } = state;
  const [categories, setCategories] = useState([])
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('bookingInfo');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/movies/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar style={{ backgroundColor: '#EE82EE',fontWeight: 'bold', fontSize: '20px', fontFamily:'TimesNew Roman' }} >
            <Container>
              

              <LinkContainer to="/">
                <Navbar.Brand>Book My Show</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/Theatre" className="nav-link">
                    Theatres
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/bookinghistory">
                        <NavDropdown.Item>Booking History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/movies">
                        <NavDropdown.Item>Movies</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/bookings">
                        <NavDropdown.Item>Booking</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/movie/:slug" element={<MovieScreen />} />
              <Route path="/Theatre" element={<TheatreList />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/tinfo" element={<Tickets />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password"
                element={<ResetPasswordScreen />}
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
           
              <Route path="/placebooking" element={<PlaceBookingScreen />} />
              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute>
                    <BookingScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/bookinghistory"
                element={
                  <ProtectedRoute>
                    <BookingHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/bookingInfo"
                element={<BookingInfoScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <BookingListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/movies"
                element={
                  <AdminRoute>
                    <MovieListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/movie/:id"
                element={
                  <AdminRoute>
                    <MovieEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
          <h2>Book My Show All rights reserved</h2>
          <h4>Contact Us!</h4>
          <p>4321-4321-4321</p>
          <p>Bookmyshow@gmail.com</p>
          </div>
        </footer>

    </BrowserRouter>
    
  );
}

export default App;
