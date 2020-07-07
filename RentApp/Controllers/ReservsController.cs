using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElectronNET.API;
using ElectronNET.API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentApp.Data;
using RentApp.Models;

namespace RentApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Reservs
        [HttpGet]
        public IEnumerable<Reserv> GetReservs()
        {
            return _context.Reservs;
        }

        // GET: api/Reservs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReserv([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var reserv = await _context.Reservs.FindAsync(id);

            if (reserv == null)
            {
                return NotFound();
            }

            return Ok(reserv);
        }

        // PUT: api/Reservs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReserv([FromRoute] int id, [FromBody] Reserv reserv)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reserv.Id)
            {
                return BadRequest();
            }

            _context.Entry(reserv).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Reservs
        [HttpPost]
        public async Task<IActionResult> PostReserv([FromBody] Reserv reserv)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Reservs.Add(reserv);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReserv", new { id = reserv.Id }, reserv);
        }

        // DELETE: api/Reservs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserv([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var reserv = await _context.Reservs.FindAsync(id);
                if (reserv == null)
                {
                    return NotFound();
                }

                _context.Reservs.Remove(reserv);
                await _context.SaveChangesAsync();

                return Ok(reserv);
            }
            catch
            {
                var options = new MessageBoxOptions("No puede eliminar un cliente si este existe en alguna reserva");
                options.Type = MessageBoxType.info;
                options.Title = "Error al eliminar cliente";
                await Electron.Dialog.ShowMessageBoxAsync(options);
                return BadRequest();
            }
           
        }

        private bool ReservExists(int id)
        {
            return _context.Reservs.Any(e => e.Id == id);
        }
    }
}