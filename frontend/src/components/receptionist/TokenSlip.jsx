
import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FaCalendarAlt,
  FaHeartbeat,
  FaPrint,
  FaQrcode,
  FaTicketAlt,
  FaUserInjured,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logo from "@/assets/logo.png";

const TokenSlip = ({ token, onClose }) => {
  const slipRef = useRef(null);

  const patientName =
    token.patient?.name || token.patient_name || token.name || "N/A";

  const tokenNo = token.token_display || token.token || "PENDING";

  const tokenDate = token.issued_at
    ? new Date(token.issued_at).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  const reason = token.reason || "General";
  const currentStatus = token.status || "WAITING";

  const qrData = `
HealthGrid OPD
Patient Name: ${patientName}
Token No: ${tokenNo}
Date: ${tokenDate}
Reason: ${reason}
Current Status: ${currentStatus}
`.trim();

  const handlePrint = () => {
    const content = slipRef.current.innerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>HealthGrid Token Slip</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: #ffffff;
              color: #000000;
            }

            .print-slip {
              width: 320px;
              max-width: 100%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e5e5e5;
              border-radius: 16px;
              text-align: center;
            }

            .logo-wrap {
              width: 56px;
              height: 56px;
              margin: 0 auto 10px;
              border-radius: 16px;
              background: #eef2ff;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .logo-icon {
              font-size: 26px;
              color: #2563eb;
            }

            .hospital-title {
              margin: 0;
              font-size: 24px;
              font-weight: 800;
              line-height: 1.2;
            }

            .hospital-subtitle {
              margin: 6px 0 18px;
              font-size: 12px;
              color: #555555;
            }

            .token-box {
              margin: 0 0 18px;
              padding: 18px 14px;
              border-radius: 14px;
              background: #f1f1f1;
            }

            .token-label {
              margin: 0 0 8px;
              font-size: 14px;
            }

            .token-number {
              margin: 0;
              font-size: 40px;
              font-weight: 900;
              letter-spacing: 1px;
              line-height: 1;
            }

            .details {
              width: 100%;
              text-align: left;
              font-size: 14px;
            }

            .detail-row {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 0;
              line-height: 1.4;
              word-break: break-word;
            }

            .detail-icon {
              width: 18px;
              min-width: 18px;
              text-align: center;
              font-size: 13px;
            }

            .detail-label {
              min-width: 58px;
              font-weight: 700;
            }

            .detail-value {
              flex: 1;
              margin-left: 2px;
            }

            .qr-box {
              margin-top: 18px;
              display: flex;
              justify-content: center;
            }

            .qr-inner {
              padding: 10px;
              border: 1px solid #e5e5e5;
              border-radius: 12px;
              background: #ffffff;
            }

            .footer-text {
              margin: 14px 0 0;
              font-size: 11px;
              color: #555555;
            }

            svg {
              vertical-align: middle;
            }

            @media print {
              body {
                padding: 0;
              }

              .print-slip {
                border: none;
              }
            }
          </style>
        </head>

        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);

    win.document.close();
  };

  return (
    <Dialog open={Boolean(token)} onOpenChange={onClose}>
      <DialogContent className="fixed inset-x-2 top-2 max-h-[calc(100svh-1rem)] w-auto translate-x-0 translate-y-0 overflow-hidden rounded-2xl p-0 sm:left-1/2 sm:top-1/2 sm:max-h-[92vh] sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2">
        <div className="max-h-[calc(100svh-1rem)] overflow-y-auto p-4 sm:max-h-[92vh] sm:p-6">
          <DialogHeader className="mb-4 space-y-2 text-left">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FaTicketAlt className="text-primary" />
              Token Slip
            </DialogTitle>

            <DialogDescription className="text-sm">
              Print or scan this OPD token slip.
            </DialogDescription>
          </DialogHeader>

          <Card className="overflow-hidden shadow-none">
            <CardContent className="p-0">
              <div
                ref={slipRef}
                className="print-slip mx-auto w-full max-w-[340px] p-4 text-center sm:p-6"
              >
                <div className="logo-wrap mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14">
                  <img
                    src={logo}
                    alt="HealthGrid logo"
                    className="h-full w-full rounded-2xl object-contain"
                  />
                </div>

                <h2 className="hospital-title text-xl font-bold sm:text-2xl">
                  HealthGrid OPD
                </h2>

                <p className="hospital-subtitle mt-1 text-xs text-muted-foreground">
                  Out Patient Department Token
                </p>

                <div className="token-box my-4 rounded-2xl bg-muted px-4 py-4 sm:my-5 sm:py-5">
                  <p className="token-label text-sm text-muted-foreground">
                    Current Token
                  </p>

                  <p className="token-number text-4xl font-black tracking-wide text-primary sm:text-5xl">
                    {tokenNo}
                  </p>
                </div>

                <div className="details space-y-1 text-left text-sm">
                  <div className="detail-row flex items-start gap-2 py-2">
                    <FaUserInjured className="detail-icon mt-1 shrink-0 text-muted-foreground" />
                    <span className="detail-label min-w-[58px] text-muted-foreground">
                      Patient:
                    </span>
                    <span className="detail-value flex-1 break-words font-medium">
                      {patientName}
                    </span>
                  </div>

                  <Separator />

                  <div className="detail-row flex items-start gap-2 py-2">
                    <FaCalendarAlt className="detail-icon mt-1 shrink-0 text-muted-foreground" />
                    <span className="detail-label min-w-[58px] text-muted-foreground">
                      Date:
                    </span>
                    <span className="detail-value flex-1 font-medium">
                      {tokenDate}
                    </span>
                  </div>

                  <Separator />

                  <div className="detail-row flex items-start gap-2 py-2">
                    <FaTicketAlt className="detail-icon mt-1 shrink-0 text-muted-foreground" />
                    <span className="detail-label min-w-[58px] text-muted-foreground">
                      Reason:
                    </span>
                    <span className="detail-value flex-1 break-words font-medium">
                      {reason}
                    </span>
                  </div>

                  <Separator />

                  <div className="detail-row flex items-start gap-2 py-2">
                    <FaHeartbeat className="detail-icon mt-1 shrink-0 text-muted-foreground" />
                    <span className="detail-label min-w-[58px] text-muted-foreground">
                      Status:
                    </span>
                    <Badge variant="secondary" className="detail-value">
                      {currentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="qr-box mt-5 flex justify-center">
                  {tokenNo !== "PENDING" ? (
                    <div className="qr-inner rounded-xl border bg-white p-2 sm:p-3">
                      <QRCodeSVG value={qrData} size={112} />
                    </div>
                  ) : (
                    <p className="flex items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      <FaQrcode />
                      Offline  - QR will be available after sync
                    </p>
                  )}
                </div>

                <p className="footer-text mt-4 text-xs text-muted-foreground">
                  Please wait for your token number to be called.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button onClick={handlePrint} className="w-full">
              <FaPrint className="mr-2" />
              Print Slip
            </Button>

            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSlip;
