import { connectDB } from '@/lib/db';
import Contractor, { IContractor } from '@/app/models/contractor';
import ContractorListClient from './ContractorListClient';

const ContractorsPage = async () => {
  await connectDB();
  const contractors = await Contractor.find().lean<IContractor[]>();

  return <ContractorListClient contractors={contractors} />;
};

export default ContractorsPage;
