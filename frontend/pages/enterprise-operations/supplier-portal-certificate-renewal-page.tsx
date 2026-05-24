import { EnterpriseOperationsFeaturePage, makeEnterpriseOperationsServerSideProps } from '../../features/enterprise-operations/enterprise-operations-feature-page';

export const getServerSideProps = makeEnterpriseOperationsServerSideProps('supplierCertificateRenewal');

export default EnterpriseOperationsFeaturePage;
