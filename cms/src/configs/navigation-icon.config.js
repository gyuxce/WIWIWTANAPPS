import React from 'react';
import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
  HiOutlineHome,
} from 'react-icons/hi';
import { BiCamera, BiFileBlank } from 'react-icons/bi';
import DashboardSvg from 'components/custom/svg/DashboardSvg';
import SettingSvg from 'components/custom/svg/SettingSvg';
import GroupSvg from 'components/custom/svg/GroupSvg';
import MoneySvg from 'components/custom/svg/MoneySvg';
import ReportSvg from 'components/custom/svg/ReportSvg';
import CalendarSvg from 'components/custom/svg/CalendarSvg';
import TripReqSvg from 'components/custom/svg/TripReqSvg';
import ReqListSvg from 'components/custom/svg/ReqListSvg';
import EmployeeReqSvg from 'components/custom/svg/EmployeeReqSvg';
import VehReqSvg from 'components/custom/svg/VehReqSvg';
import FinanceReqSvg from 'components/custom/svg/FinanceReqSvg';
import FinancePersonSvg from 'components/custom/svg/FinancePersonSvg';
import FinanceVehicleSvg from 'components/custom/svg/FinanceVehicleSvg';
import VehicleSvg from 'components/custom/svg/VehicleSvg';
import GearSvg from 'components/custom/svg/GearSvg';
import ChatSvg from 'components/custom/svg/ChatSvg';
import MoneyExpenseSvg from 'components/custom/svg/MoneyExpenseSvg';
import LineChartSvg from 'components/custom/svg/LineChartSvg';
import FileSvg from 'components/custom/svg/FileSvg';
import AccountSettingSvg from 'components/custom/svg/AccountSettingSvg';
import BookSvg from 'components/custom/svg/BookSvg';
import EmployeeSvg from 'components/custom/svg/EmployeeSvg';
import CarIconSvg from 'components/custom/svg/CarIconSvg';
import FileImportSvg from 'components/custom/svg/FileImportSvg';
import EmployeeRoleSvg from 'components/custom/svg/EmployeeRoleSvg';
import ConfigSvg from 'components/custom/svg/ConfigSvg';
import CertificateSvg from 'components/custom/svg/CertificateSvg';
import CertificateKanjiSvg from 'components/custom/svg/CertificateKanjiSvg';
import BellSvg from 'components/custom/svg/BellSvg';
import PeopleSvg from 'components/custom/svg/PeopleSvg';
import CurveLineSvg from 'components/custom/svg/CurveLineSvg';
import CurveLineActiveSvg from 'components/custom/svg/CurveLineActiveSvg';
import LogoutSvg from 'components/custom/svg/LogoutSvg';
import SeminarSvg from 'components/custom/svg/SeminarSvg';

const navigationIcon = {
  home: <HiOutlineHome />,
  singleMenu: <HiOutlineViewGridAdd />,
  collapseMenu: <HiOutlineTemplate />,
  groupSingleMenu: <HiOutlineDesktopComputer />,
  groupCollapseMenu: <HiOutlineColorSwatch />,
  dashboard: <DashboardSvg />,
  camera: <BiCamera />,
  linechart: <LineChartSvg />,
  file: <BiFileBlank size={20} />,
  book: <BookSvg />,
  wrench: <SettingSvg />,
  customer: <GroupSvg />,
  employee: <EmployeeSvg />,
  money: <MoneySvg />,
  report: <ReportSvg />,
  calendar: <CalendarSvg />,
  tripRequest: <TripReqSvg />,
  reqList: <ReqListSvg />,
  employeeRequest: <EmployeeReqSvg />,
  employeeRole: <EmployeeRoleSvg />,
  vehicleRequest: <VehReqSvg />,
  vehicle: <VehicleSvg />,
  financeRequest: <FinanceReqSvg />,
  financePerson: <FinancePersonSvg />,
  financeVehicle: <FinanceVehicleSvg />,
  gear: <GearSvg />,
  chat: <ChatSvg />,
  tripExpense: <MoneyExpenseSvg />,
  document: <FileSvg />,
  accountSetting: <AccountSettingSvg />,
  car: <CarIconSvg />,
  importFile: <FileImportSvg />,
  config: <ConfigSvg />,
  certificate: <CertificateSvg />,
  certificateKanji: <CertificateKanjiSvg />,
  bell: <BellSvg />,
  seminar: <SeminarSvg />,
  people: <PeopleSvg />,
  curveLine: <CurveLineSvg />,
  curveLineActive: <CurveLineActiveSvg />,
  logout: <LogoutSvg />,
};

export default navigationIcon;
