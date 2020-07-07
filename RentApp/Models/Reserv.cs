using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentApp.Models
{
    public class Reserv : IEntity
    {
        public int Id { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public float RealPayment { get; set; }
        public float FictionalPayment { get; set; }
        public string ReservationMethod { get; set; }
        public bool? Consume { get; set; }
        public int Rating { get; set; }

        public List<ClientReserv> ClientsReserv { get; set; }
    }
}
