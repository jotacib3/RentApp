using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentApp.Models
{
    public class ClientReserv : IEntity
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public int ReservId { get; set; }
        public string Code { get; set; }

        public Client Client { get; set; }
        public Reserv Reserv { get; set; }
    }
}
