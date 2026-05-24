import { EnterpriseExpansionFeaturePage, makeEnterpriseExpansionServerSideProps } from '../../features/enterprise-expansion/enterprise-expansion-feature-page';

export const getServerSideProps = makeEnterpriseExpansionServerSideProps('aiBookkeeping');

export default EnterpriseExpansionFeaturePage;
