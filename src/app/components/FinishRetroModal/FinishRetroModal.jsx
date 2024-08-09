import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  getCardsFromFirestore,
  getActionItemsFromFirestore,
} from "@/services/fireStoreService";
import { useRouter } from "next/navigation";

const columnTitles = {
  1: "Sunny",
  2: "Thunderstorm",
  3: "Rainbow",
  4: "Cloudy",
};

const FinishRetroModal = ({ visible, onClose, roomId }) => {
  const [cards, setCards] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    if (visible && roomId) {
      setLoading(true);
      Promise.all([
        getCardsFromFirestore(roomId, "1"),
        getCardsFromFirestore(roomId, "2"),
        getCardsFromFirestore(roomId, "3"),
        getCardsFromFirestore(roomId, "4"),
        getActionItemsFromFirestore(roomId),
      ])
        .then(([cards1, cards2, cards3, cards4, actionItems]) => {
          setCards([
            { columnId: "1", cards: cards1 },
            { columnId: "2", cards: cards2 },
            { columnId: "3", cards: cards3 },
            { columnId: "4", cards: cards4 },
          ]);
          setActionItems(actionItems);
        })
        .catch((error) => {
          console.error("Error loading data: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, roomId]);

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const content = document.getElementById("modal-content");

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      let height = pdfWidth / ratio;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, height);
      pdf.save("retro_report.pdf");
    });
  };

  const handleFinishRetro = () => {
    router.push("/homepage"); 
    onClose(); 
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" style={{backgroundColor: '#543aaa', color: 'white'}} onClick={downloadPDF}>
          Download PDF
        </Button>,
        <Button key="start"  onClick={handleFinishRetro}>
          Finish Retro
        </Button>,
      ]}
      bodyStyle={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div id="modal-content">
          <h2 style={{fontSize: '30px', fontWeight: 'bold'}}>Retro Completed</h2>
          {cards.map(({ columnId, cards: columnCards }) => {
            const columnTitle = columnTitles[columnId] || "Unknown Column";
            return (
              <div key={columnId}>
                <h3 style={{color: '#543aaa', fontWeight: 'bold', fontSize: '20px'}}>{columnTitle}</h3>
                <ul>
                  {columnCards.map((card, index) => (
                    <li key={index}>{card.text || "No text available"}</li>
                  ))}
                </ul>
              </div>
            );
          })}

          <h3 style={{color: '#543aaa', fontWeight: 'bold', fontSize: '20px'}}>Action Items</h3>
          <ul>
            {actionItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "15px" }}>
                <strong style={{color: '#E8602D'}}>Action Item {index + 1}</strong>
                <br />
                <strong>Action:</strong> {item.action || "No action available"}
                <br />
                <strong>Owner:</strong> {item.owner || "No owner available"}
                <br />
                <strong>Due Date:</strong>{" "}
                {item.dueDate || "No due date available"}
                <br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default FinishRetroModal;
