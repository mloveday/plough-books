import * as React from 'react';
import "./CashUp.css";

export class CashUp extends React.Component {
  public render() {
    return (
    <form className="form-wrapper">
      <h3 className="group-title summary_title">Summary</h3>
      <div className="label-and-input mod"><label htmlFor="mod">MOD</label><input id="mod" type="text" /></div>
      <div className="label-and-input daily_notes"><label htmlFor="daily_notes">Daily notes</label><textarea id="daily_notes" /></div>

      <div className="till-labels">
        <div className="till-label">1</div>
        <div className="till-label">2</div>
        <div className="till-label">3</div>
        <div className="till-label">4</div>
        <div className="till-label">5</div>
        <div className="till-label">6</div>
        <div className="till-label">7</div>
      </div>

      <h3 className="group-title till_float_title">Till float</h3>
      <div className="per-till till_float_tills">
        <div className="label-and-input"><label htmlFor="tf_1">Till 1</label><input id="tf_1" type="number" /></div>
        <div className="label-and-input"><label htmlFor="tf_2">Till 2</label><input id="tf_2" type="number" /></div>
        <div className="label-and-input"><label htmlFor="tf_3">Till 3</label><input id="tf_3" type="number" /></div>
        <div className="label-and-input"><label htmlFor="tf_4">Till 4</label><input id="tf_4" type="number" /></div>
        <div className="label-and-input"><label htmlFor="tf_5">Till 5</label><input id="tf_5" type="number" /></div>
        <div className="label-and-input"><label htmlFor="tf_6">Till 6</label><input id="tf_6" type="number" /></div>
        <div className="label-and-input"><label htmlFor="tf_7">Till 7</label><input id="tf_7" type="number" /></div>
      </div>

      <h4 className="group-label amex_label">AMEX</h4>
      <div className="per-till amex_tills">
        <div className="label-and-input"><label htmlFor="amex_1">AMEX 1</label><input id="amex_1" type="number" /></div>
        <div className="label-and-input"><label htmlFor="amex_2">AMEX 2</label><input id="amex_2" type="number" /></div>
        <div className="label-and-input"><label htmlFor="amex_3">AMEX 3</label><input id="amex_3" type="number" /></div>
        <div className="label-and-input"><label htmlFor="amex_4">AMEX 4</label><input id="amex_4" type="number" /></div>
        <div className="label-and-input"><label htmlFor="amex_5">AMEX 5</label><input id="amex_5" type="number" /></div>
        <div className="label-and-input"><label htmlFor="amex_6">AMEX 6</label><input id="amex_6" type="number" /></div>
        <div className="label-and-input"><label htmlFor="amex_7">AMEX 7</label><input id="amex_7" type="number" /></div>
      </div>
      <h4 className="group-label visa_label">VISA</h4>
      <div className="per-till visa_tills">
        <div className="label-and-input"><label htmlFor="visa_1">VISA 1</label><input id="visa_1" type="number" /></div>
        <div className="label-and-input"><label htmlFor="visa_2">VISA 2</label><input id="visa_2" type="number" /></div>
        <div className="label-and-input"><label htmlFor="visa_3">VISA 3</label><input id="visa_3" type="number" /></div>
        <div className="label-and-input"><label htmlFor="visa_4">VISA 4</label><input id="visa_4" type="number" /></div>
        <div className="label-and-input"><label htmlFor="visa_5">VISA 5</label><input id="visa_5" type="number" /></div>
        <div className="label-and-input"><label htmlFor="visa_6">VISA 6</label><input id="visa_6" type="number" /></div>
        <div className="label-and-input"><label htmlFor="visa_7">VISA 7</label><input id="visa_7" type="number" /></div>
      </div>
      <h4 className="group-label charge_deposit_label">Charge & deposit</h4>
      <div className="label-and-input charge_to_ac"><label htmlFor="charge_to_ac">Charge to account</label><input id="charge_to_ac" type="number" /></div>
      <div className="label-and-input deposit_redeemed"><label htmlFor="deposit_redeemed">Deposit redeemed</label><input id="deposit_redeemed" type="number" /></div>
      <h4 className="group-label fifty_label">£50</h4>
      <div className="per-till fifty_tills">
        <div className="label-and-input"><label htmlFor="cash_50_1">£50 Till 1</label><input id="cash_50_1" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50_2">£50 Till 2</label><input id="cash_50_2" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50_3">£50 Till 3</label><input id="cash_50_3" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50_4">£50 Till 4</label><input id="cash_50_4" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50_5">£50 Till 5</label><input id="cash_50_5" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50_6">£50 Till 6</label><input id="cash_50_6" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50_7">£50 Till 7</label><input id="cash_50_7" type="number" /></div>
      </div>
      <h4 className="group-label twenty_label">£20</h4>
      <div className="per-till twenty_tills">
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 1</label><input id="cash_20_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 2</label><input id="cash_20_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 3</label><input id="cash_20_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 4</label><input id="cash_20_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 5</label><input id="cash_20_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 6</label><input id="cash_20_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20_">£20 Till 7</label><input id="cash_20_" type="number" /></div>
      </div>
      <h4 className="group-label ten_label">£10</h4>
      <div className="per-till ten_tills">
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 1</label><input id="cash_10_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 2</label><input id="cash_10_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 3</label><input id="cash_10_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 4</label><input id="cash_10_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 5</label><input id="cash_10_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 6</label><input id="cash_10_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10_">£10 Till 7</label><input id="cash_10_" type="number" /></div>
      </div>
      <h4 className="group-label five_label">£5</h4>
      <div className="per-till five_tills">
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 1</label><input id="cash_5_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 2</label><input id="cash_5_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 3</label><input id="cash_5_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 4</label><input id="cash_5_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 5</label><input id="cash_5_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 6</label><input id="cash_5_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5_">£5 Till 7</label><input id="cash_5_" type="number" /></div>
      </div>
      <h4 className="group-label pounds_label">£1 &amp; £2</h4>
      <div className="per-till pounds_tills">
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 1</label><input id="cash_pounds_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 2</label><input id="cash_pounds_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 3</label><input id="cash_pounds_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 4</label><input id="cash_pounds_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 5</label><input id="cash_pounds_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 6</label><input id="cash_pounds_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_pounds_">£1 &amp; £2 Till 7</label><input id="cash_pounds_" type="number" /></div>
      </div>
      <h4 className="group-label fifty_p_label">50p</h4>
      <div className="per-till fifty_p_tills">
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 1</label><input id="cash_50p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 2</label><input id="cash_50p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 3</label><input id="cash_50p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 4</label><input id="cash_50p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 5</label><input id="cash_50p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 6</label><input id="cash_50p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_50p_">50p Till 7</label><input id="cash_50p_" type="number" /></div>
      </div>
      <h4 className="group-label twenty_p_label">20p</h4>
      <div className="per-till twenty_p_tills">
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 1</label><input id="cash_20p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 2</label><input id="cash_20p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 3</label><input id="cash_20p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 4</label><input id="cash_20p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 5</label><input id="cash_20p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 6</label><input id="cash_20p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_20p_">20p Till 7</label><input id="cash_20p_" type="number" /></div>
      </div>
      <h4 className="group-label ten_p_label">10p</h4>
      <div className="per-till ten_p_tills">
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 1</label><input id="cash_10p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 2</label><input id="cash_10p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 3</label><input id="cash_10p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 4</label><input id="cash_10p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 5</label><input id="cash_10p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 6</label><input id="cash_10p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_10p_">10p Till 7</label><input id="cash_10p_" type="number" /></div>
      </div>
      <h4 className="group-label five_p_label">5p</h4>
      <div className="per-till five_p_tills">
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 1</label><input id="cash_5p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 2</label><input id="cash_5p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 3</label><input id="cash_5p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 4</label><input id="cash_5p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 5</label><input id="cash_5p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 6</label><input id="cash_5p_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_5p_">5p Till 7</label><input id="cash_5p_" type="number" /></div>
      </div>
      <h4 className="group-label z_label">Z</h4>
      <div className="per-till z_tills">
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 1</label><input id="cash_Z_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 2</label><input id="cash_Z_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 3</label><input id="cash_Z_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 4</label><input id="cash_Z_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 5</label><input id="cash_Z_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 6</label><input id="cash_Z_" type="number" /></div>
        <div className="label-and-input"><label htmlFor="cash_Z_">Z Till 7</label><input id="cash_Z_" type="number" /></div>
      </div>

      <h3 className="group-title discounts_label">Discounts</h3>
      <div className="label-and-input comps_wet"><label htmlFor="comps_wet">Wet Comps</label><input id="comps_wet" type="number" /></div>
      <div className="label-and-input d_staff_dry"><label htmlFor="d_staff_dry">Discount staff dry</label><input id="d_staff_dry" type="number" /></div>
      <div className="label-and-input d_customers_wet"><label htmlFor="d_customers_wet">Discount customers wet</label><input id="d_customers_wet" type="number" /></div>
      <div className="label-and-input d_customers_dry"><label htmlFor="d_customers_dry">Discount customers dry</label><input id="d_customers_dry" type="number" /></div>
      <div className="label-and-input d_customers_coffee"><label htmlFor="d_customers_coffee">Discount customer coffee</label><input id="d_customers_coffee" type="number" /></div>
      <div className="label-and-input fwt_wet"><label htmlFor="fwt_wet">FWT wet</label><input id="fwt_wet" type="number" /></div>
      <div className="label-and-input como_in_drawer"><label htmlFor="como_in_drawer">COMO in drawer</label><input id="como_in_drawer" type="number" /></div>

      <h3 className="group-title credit_card_label">Credit card totals</h3>
      <div className="label-and-input amex_tots"><label htmlFor="amex_tots">AMEX total</label><input id="amex_tots" type="number" /></div>
      <div className="label-and-input visa_mc_tots"><label htmlFor="visa_mc_tots">VISA/MC total</label><input id="visa_mc_tots" type="number" /></div>

      <h3 className="group-title receipts_label">Cash Receipts</h3>
      <div className="label-and-input receipt_desc"><label htmlFor="receipt_desc_01">Receipt description</label><input id="receipt_desc_01" type="text" /></div>
      <div className="label-and-input receipt_amnt"><label htmlFor="receipt_amnt_01">Receipt amount</label><input id="receipt_amnt_01" type="number" /></div>
      {/*TODO: ...etc: allow adding extra rows of this*/}
      <div className="label-and-input spend_staff_pts"><label htmlFor="spend_staff_points">Spend & staff points</label><input id="spend_staff_points" type="number" /></div>
      <div className="label-and-input como_disc_asset"><label htmlFor="como_disc_asset">COMO Discount asset</label><input id="como_disc_asset" type="number" /></div>

      <h3 className="group-title nett_takes_label">Nett takes</h3>
      <div className="label-and-input take_dry"><label htmlFor="take_dry">Dry</label><input id="take_dry" type="number" /></div>
      <div className="label-and-input take_coffee"><label htmlFor="take_coffee">Coffee</label><input id="take_coffee" type="number" /></div>
      <div className="label-and-input take_gift_card"><label htmlFor="take_gift_card">Gift card</label><input id="take_gift_card" type="number" /></div>
      <div className="label-and-input take_deposit_paid"><label htmlFor="take_deposit_paid">Deposit paid</label><input id="take_deposit_paid" type="number" /></div>

      <h3 className="group-title banking_label">Banking</h3>
      <div className="label-and-input paid_out_amnt"><label htmlFor="paid_out_amnt">Paid out</label><input id="paid_out_amnt" type="number" /></div>
      <div className="label-and-input paid_out_to"><label htmlFor="paid_out_to">Paid out to</label><input id="paid_out_to" type="text" /></div>
      <div className="label-and-input banked"><label htmlFor="banked">Banked</label><input id="banked" type="number" /></div>
      <div className="label-and-input cash_advantage_bag"><label htmlFor="cash_advantage_bag">Cash advantage bag</label><input id="cash_advantage_bag" type="number" /></div>
      <div className="label-and-input cash_advantage_bag_seen_by"><label htmlFor="cash_advantage_bag_seen_by">Seen by</label><input id="cash_advantage_bag_seen_by" type="text" /></div>

      <h3 className="group-title safe_float_label">Safe float denom</h3>
      <div className="safe_float_denom_time_groups">
      <div className="safe_float_am">
        <h4 className="group-label">AM</h4>
        <div className="label-and-input"><label htmlFor="sfd_am_50">£50</label><input id="sfd_am_50" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_20">£20</label><input id="sfd_am_20" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_10">£10</label><input id="sfd_am_10" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_5">£5</label><input id="sfd_am_5" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_pounds">£1 &amp; £2</label><input id="sfd_am_pounds" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_50p">50p</label><input id="sfd_am_50p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_20p">20p</label><input id="sfd_am_20p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_10p">10p</label><input id="sfd_am_10p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_5p">5p</label><input id="sfd_am_5p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_am_initial">Initial</label><input id="sfd_am_initial" type="text" /></div>
      </div>
      <div className="safe_float_pm">
        <h4 className="group-label safe_float_pm">PM</h4>
        <div className="label-and-input"><label htmlFor="sfd_pm_50">£50</label><input id="sfd_pm_50" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_20">£20</label><input id="sfd_pm_20" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_10">£10</label><input id="sfd_pm_10" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_5">£5</label><input id="sfd_pm_5" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_pounds">£1 &amp; £2</label><input id="sfd_pm_pounds" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_50p">50p</label><input id="sfd_pm_50p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_20p">20p</label><input id="sfd_pm_20p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_10p">10p</label><input id="sfd_pm_10p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_5p">5p</label><input id="sfd_pm_5p" type="number" /></div>
        <div className="label-and-input"><label htmlFor="sfd_pm_initial">Initial</label><input id="sfd_pm_initial" type="text" /></div>
      </div>
      </div>
      <div className="label-and-input safe_float_notes"><label htmlFor="sfd_notes">Notes</label><input id="sfd_notes" type="text" /></div>

      <h3 className="group-title summary_label">Summary</h3>
      <div className="label-and-input pub_secured_by"><label htmlFor="pub_secured_by">Pub secured by</label><input id="pub_secured_by" type="text" /></div>
      <div className="label-and-input bar_closed_by"><label htmlFor="bar_closed_by">Bar closed by</label><input id="bar_closed_by" type="text" /></div>
      <div className="label-and-input floor_closed_by"><label htmlFor="floor_closed_by">Floor closed by</label><input id="floor_closed_by" type="text" /></div>
      <div className="label-and-input next_door_by"><label htmlFor="next_door_by">Next door by</label><input id="next_door_by" type="text" /></div>
    </form>
    )
  }
}