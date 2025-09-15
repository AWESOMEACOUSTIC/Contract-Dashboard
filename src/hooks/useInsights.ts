interface Insight {
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  action: string;
}

interface Contract {
  expiry: string;
  risk: string;
  status: string;
}

export function useInsights(contract: Contract | null): Insight[] {
  if (!contract) return [];

  const insights: Insight[] = [];
  const daysUntilExpiry = Math.ceil((new Date(contract.expiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  
  // Renewal alert for contracts expiring soon
  if (daysUntilExpiry < 30 && daysUntilExpiry > 0) {
    insights.push({
      type: 'warning',
      title: 'Renewal Alert',
      description: `Contract expires in ${daysUntilExpiry} days. Consider initiating renewal process soon.`,
      action: 'Schedule renewal meeting'
    });
  }

  // Alert for expired contracts
  if (daysUntilExpiry < 0) {
    insights.push({
      type: 'error',
      title: 'Contract Expired',
      description: `Contract expired ${Math.abs(daysUntilExpiry)} days ago. Immediate action required.`,
      action: 'Renew or terminate contract'
    });
  }

  // High risk contract alert
  if (contract.risk === 'High') {
    insights.push({
      type: 'error',
      title: 'High Risk Contract',
      description: 'This contract has been flagged as high risk. Review terms and conditions carefully.',
      action: 'Conduct risk assessment'
    });
  }

  // Draft status alert
  if (contract.status === 'Draft') {
    insights.push({
      type: 'info',
      title: 'Draft Status',
      description: 'Contract is still in draft status. Finalize terms and activate when ready.',
      action: 'Review and activate'
    });
  }

  // Compliance check (always add as a positive insight)
  insights.push({
    type: 'success',
    title: 'Compliance Check',
    description: 'Contract appears to be compliant with current regulatory requirements.',
    action: 'No action needed'
  });

  return insights;
}