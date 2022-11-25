import React from 'react';

export default function TooltipTemplate(info) {
  const data = info?.point?.data;
  return (
    <div className="state-tooltip">
      <h4 className="state">{info.argument}</h4><br/>
      <div className="count">
        <span className="caption">Count</span>: {info.value}
      </div>
      {data.lead_owner? 
      <div className="count">
        <span className="caption">LeadOwner</span>: {data.lead_owner}
      </div> : <></>
      }
      {data.acc_holder? 
      <div className="count">
        <span className="caption">AccountHolder</span>: {data.acc_holder}
      </div> : <></>
      }
      {data.company_name ? 
      <div className="count">
        <span className="caption">CompanyName</span>: {data.company_name}
      </div> : <></>
      }
      {data.customer_name ? 
      <div className="count">
        <span className="caption">CustomerName</span>: {data.customer_name}
      </div> : <></>
      }
    </div>
  );
}
